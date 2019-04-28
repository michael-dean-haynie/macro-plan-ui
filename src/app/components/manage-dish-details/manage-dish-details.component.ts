import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { UnitTypeEnum } from 'src/app/enums/unit-type.enum';
import { Unit } from 'src/app/models/api/unit.model';
import { ApiDishService } from 'src/app/services/api-dish.service';
import { ApiUnitService } from 'src/app/services/api-unit.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogComponent } from '../dialog/dialog.component';
import { UnitEnum } from './../../enums/unit.enum';
import { Dish } from './../../models/api/dish.model';
import { HelperDishService } from './../../services/helper-dish.service';
import { HelperUnitService } from './../../services/helper-unit.service';

@Component({
  selector: 'app-manage-dish-details',
  templateUrl: './manage-dish-details.component.html',
  styleUrls: ['./manage-dish-details.component.scss']
})
export class ManageDishDetailsComponent implements OnInit {
  // routing
  dishId: number;
  idLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when id is loaded
  createMode = false;

  // api results
  units: Unit[];
  unitsLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when units are loaded
  dish: Dish;

  // form controls
  dishForm: FormGroup;
  dishFormBuilt$ = new ReplaySubject<boolean>(); // <-- will emit a value when dish form has been built

  // template accessible enums
  unitTypes: UnitTypeEnum[];

  // loading (will be set to false once all data needed for rendering is ready)
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private apiDishService: ApiDishService,
    private apiUnitService: ApiUnitService,
    private helperUnitService: HelperUnitService,
    private helperDishService: HelperDishService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // load unit types
    this.unitTypes = this.helperUnitService.getUnitTypeEnumList();

    // load units
    this.apiUnitService.getUnits().subscribe(
      units => {
        this.units = units;
        this.unitsLoaded$.next(true); // <-- emit value indicating units are loaded
      }, (error) => {
        this.snackBarService.showError();
      });

    // build form controls
    this.unitsLoaded$.subscribe(() => {
      this.buildDefaultFormControls();
    });

    // load dish id
    this.route.params.subscribe(params => {
      if (params['id'] === 'create') {
        this.createMode = true;
      } else {
        this.dishId = +params['id']; // <-- convert to number
      }

      this.idLoaded$.next(true); // <-- emit value indicating id has been
    });

    // load food
    this.idLoaded$.subscribe(() => {
      this.loadDish();
    });
  }

  /**
   * ----------------------------------------
   * User Input
   * ----------------------------------------
   */

  onClickDeleteDish(): void {
    const dialog = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete "${this.dish.name}"?`,
        content: 'This action cannot be undone.',
        cancel: 'Nevermind',
        confirm: 'Yes, Delete'
      }
    });
    dialog.afterClosed().subscribe(doDelete => {
      if (doDelete) {
        this.onConfirmDeleteDish();
      }
    });
  }

  onConfirmDeleteDish(): void {
    this.apiDishService.delete(this.dishId).subscribe(
      () => {
        this.snackBarService.showSuccess(`Successfully deleted "${this.dish.name}"`);
        this.router.navigate(['manage-dishes']);
      },
      (error) => {
        this.snackBarService.showError(`Something went wrong. Could not delete "${this.dish.name}"`);
      });
  }

  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadDish(): void {
    if (this.createMode) {
      this.dishFormBuilt$.subscribe(() => {
        this.dish = this.helperDishService.getEmptyDish();
        this.loading = false;
      });
    } else {
      this.apiDishService.get(this.dishId).subscribe(
        dish => {
          this.dish = dish;
          this.populateFormDataWithApiModel();
        },
        (error) => { this.snackBarService.showError(); });
    }
  }

  private populateFormDataWithApiModel(): void {
    this.dishFormBuilt$.subscribe(() => {
      // load dish data into form controls
      this.dishForm.patchValue({
        name: this.dish.name,
      });

      // empty default, then load existing measurements
      this.dishForm.setControl('measurements', new FormArray([]));
      this.dishForm.get('measurements').setValidators(Validators.required);
      this.dish.measurements.forEach(mmt => {
        const mmtCtrlArray = this.dishForm.get('measurements') as FormArray;
        mmtCtrlArray.push(this.fb.group({
          amount: [mmt.amount],
          unitType: [mmt.unit.unitType],
          unit: [mmt.unit.unit],
        }));
      });

      // empty default, then load existing ingredients
      this.dishForm.setControl('ingredients', new FormArray([]));
      this.dishForm.get('ingredients').setValidators(Validators.required);
      this.dish.ingredients.forEach(ingredient => {
        const ingredientCtrlArray = this.dishForm.get('ingredients') as FormArray;
        ingredientCtrlArray.push(this.fb.group({
          foodId: [ingredient.food.id],
          measurement: this.fb.group({
            amount: [ingredient.measurement.amount],
            unitType: [ingredient.measurement.unit.unitType],
            unit: [ingredient.measurement.unit.unit]
          })
        }));
      });

      this.loading = false;
    });
  }

  private buildDefaultFormControls(): void {
    this.dishForm = this.fb.group({
      name: [''],
      measurements: this.fb.array(
        [
          this.buildDefaultMeasurement(),
        ],
        {
          validators: Validators.required
        }
      ),
      ingredients: this.fb.array(
        [
          this.buildDefaultIngredient(),
        ],
        {
          validators: Validators.required
        }
      ),
    });

    this.dishFormBuilt$.next(true);
  }

  private buildDefaultMeasurement(): FormGroup {
    return this.fb.group({
      amount: [1],
      unitType: [UnitTypeEnum.VOLUME],
      unit: [UnitEnum.CUP]
    });
  }

  private buildDefaultIngredient(): FormGroup {
    return this.fb.group({
      foodId: [1],
      measurement: this.buildDefaultMeasurement()
    });
  }

}
