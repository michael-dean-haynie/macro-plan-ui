import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Food } from 'src/app/models/api/food.model';
import { Unit } from 'src/app/models/api/unit.model';
import { ApiFoodService } from 'src/app/services/api-food.service';
import { HelperUnitService } from 'src/app/services/helper-unit.service';
import { UnitTypeEnum } from './../../enums/unit-type.enum';
import { UnitEnum } from './../../enums/unit.enum';
import { ApiUnitService } from './../../services/api-unit.service';

@Component({
  selector: 'app-manage-food-details',
  templateUrl: './manage-food-details.component.html',
  styleUrls: ['./manage-food-details.component.scss']
})
export class ManageFoodDetailsComponent implements OnInit {
  // routing
  foodId: number;
  idLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when units are loaded
  createMode = false;

  // api results
  units: Unit[];
  unitsLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when units are loaded
  food: Food;

  // form controls
  foodForm: FormGroup;
  foodFormBuilt$ = new ReplaySubject<boolean>() // <-- will emit a value when food form has been built


  // loading (will be set to true once all data needed for rendering is ready)
  loading = true;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiFoodService: ApiFoodService,
    private apiUnitService: ApiUnitService,
    private helperUnitService: HelperUnitService
  ) { }

  ngOnInit() {
    // load units
    this.apiUnitService.getUnits().subscribe(units => {
      this.units = units;
      this.unitsLoaded$.next(true); // <-- emit value indicating units are loaded
    });

    // load food id
    this.route.params.subscribe(params => {
      // TODO? maybe check if 'create' here?
      this.foodId = +params['id']; // <-- convert to number

      this.idLoaded$.next(true); // <-- emit value indicating idhas been
    });

    // load food
    this.idLoaded$.subscribe(() => {
      this.loadFood();
    });

    // build form controls
    this.unitsLoaded$.subscribe(() => {
      this.buildDefaultFormControls();
    });
  }

  // TODO save stuffz
  onSubmit(): void { }

  getMeasurementsFormGroups(): FormGroup[] {
    const formArray = this.foodForm.get('measurements') as FormArray;
    return formArray.controls.map(c => c as FormGroup);
  }

  getUnitsOfType(unitType: UnitTypeEnum): UnitEnum[] {
    return this.helperUnitService.getUnitsOfType(unitType, this.units);
  }

  private loadFood(): void {
    this.apiFoodService.getFood(this.foodId).subscribe(food => {
      console.log(food); // TODO REMOVE
      this.food = food;

      // If we're updating (not creating) then patch form values with existing data
      if (!this.createMode) {
        this.foodFormBuilt$.subscribe(() => {
          // load food data into form controls
          this.foodForm.patchValue({
            name: food.name,
            brand: food.brand,
            styleOrFlavor: food.styleOrFlavor,
            calories: food.calories,
            fat: food.fat,
            carbs: food.carbs,
            protein: food.protein,
            // measurements set seperately
          });

          // empty default, then load existing measurements
          this.foodForm.setControl('measurements', new FormArray([]));
          this.food.measurements.forEach(mmt => {
            const mmtCtrlArray = this.foodForm.get('measurements') as FormArray;
            mmtCtrlArray.push(this.fb.group({
              value: [mmt.value],
              unitType: [mmt.unit.unitType],
              unit: [mmt.unit.unit],
            }));
          });
        });

        this.loading = false;
      }
    });
  }

  private buildDefaultFormControls(): void {
    this.foodForm = this.fb.group({
      name: [''],
      brand: [''],
      styleOrFlavor: [''],
      calories: [null],
      fat: [null],
      carbs: [null],
      protein: [null],
      measurements: this.fb.array([
        this.fb.group({
          value: [null],
          // TODO: Flatten this out
          unit: [
            this.fb.group({
              unitSystem: [null],
              unitType: [null],
              unit: [null],
            })
          ]
        })
      ])
    });

    this.foodFormBuilt$.next(true);
  }

}
