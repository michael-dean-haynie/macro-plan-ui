import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Food } from 'src/app/models/api/food.model';
import { Measurement } from 'src/app/models/api/measurement.model';
import { Unit } from 'src/app/models/api/unit.model';
import { FoodApiService } from 'src/app/services/api/food-api.service';
import { UnitHelperService } from 'src/app/services/model-helper/unit-helper.service';
import { UnitApiService } from '../../services/api/unit-api.service';
import { FoodHelperService } from '../../services/model-helper/food-helper.service';
import { UnitTypeEnum } from './../../enums/unit-type.enum';
import { UnitEnum } from './../../enums/unit.enum';
import { HeadingService } from './../../services/heading.service';
import { SnackBarService } from './../../services/snack-bar.service';
import { DialogComponent } from './../dialog/dialog.component';

@Component({
  selector: 'app-manage-food-details',
  templateUrl: './manage-food-details.component.html',
  styleUrls: ['./manage-food-details.component.scss']
})
export class ManageFoodDetailsComponent implements OnInit {
  // routing
  foodId: number;
  idLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when id is loaded
  createMode = false;

  // api results
  units: Unit[];
  unitsLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when units are loaded
  food: Food;

  // form controls
  foodForm: FormGroup;
  foodFormBuilt$ = new ReplaySubject<boolean>(); // <-- will emit a value when food form has been built

  // template accessible enums
  unitTypes: UnitTypeEnum[];

  // loading (will be set to false once all data needed for rendering is ready)
  loading = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private foodApiService: FoodApiService,
    private unitApiService: UnitApiService,
    private unitHelperService: UnitHelperService,
    private foodHelperService: FoodHelperService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private headingService: HeadingService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Food');

    // load unit types
    this.unitTypes = this.unitHelperService.getUnitTypeEnumList();

    // load units
    this.unitApiService.getUnits().subscribe(
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

    // load food id
    this.route.params.subscribe(params => {
      if (params['id'] === 'create') {
        this.createMode = true;
      } else {
        this.foodId = +params['id']; // <-- convert to number
      }

      this.idLoaded$.next(true); // <-- emit value indicating id has been
    });

    // load food
    this.idLoaded$.subscribe(() => {
      this.loadFood();
    });
  }

  /**
   * ----------------------------------------
   * User Input
   * ----------------------------------------
   */

  onClickCancel(): void {
    this.location.back();
  }


  onClickDeleteFood(): void {
    const dialog = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete "${this.food.name}"?`,
        // TODO: do not let user delete food templates that are a part of a dish
        content: 'This action cannot be undone.',
        cancel: 'Nevermind',
        confirm: 'Yes, Delete'
      }
    });
    dialog.afterClosed().subscribe(doDelete => {
      if (doDelete) {
        this.onConfirmDeleteFood();
      }
    });
  }

  onConfirmDeleteFood(): void {
    this.foodApiService.delete(this.foodId).subscribe(
      () => {
        this.snackBarService.showSuccess(`Successfully deleted "${this.food.name}"`);
        this.router.navigate(['manage-food']);
      },
      (error) => {
        this.snackBarService.showError(`Something went wrong. Could not delete "${this.food.name}"`);
      });
  }

  onSubmit(): void {
    if (this.foodForm.valid) {
      this.populateApiModelWithFormData();

      if (this.createMode) {
        this.foodApiService.create(this.food).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully created "${this.food.name}"`);
            this.router.navigate(['manage-food']);
          }, (error) => {
            this.snackBarService.showError(`Something went wrong. Could not create "${this.food.name}"`);
          });
      } else {
        this.foodApiService.update(this.food).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully updated "${this.food.name}"`);
            this.router.navigate(['manage-food']);
          },
          (error) => {
            this.snackBarService.showError(`Something went wrong. Could not update "${this.food.name}"`);
          });
      }

    } else {
      // TODO: let user know
    }
  }

  // clear value of unit select and mark touched so validation kicks in
  onUnitTypeChange(index: number): void {
    const unitCtrl = this.foodForm.get(['measurements', index, 'unit']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();
  }

  onClickDeleteMeasurement(index: number): void {
    // TODO: use modal for confirmation first?
    const measurementsFormArray = this.foodForm.get('measurements') as FormArray;
    measurementsFormArray.removeAt(index);
    measurementsFormArray.markAsTouched();
  }

  onClickAddMeasurement(): void {
    const measurementsFormArray = this.foodForm.get('measurements') as FormArray;
    measurementsFormArray.push(this.buildDefaultMeasurement());
    measurementsFormArray.markAsTouched();
  }

  /**
   * ----------------------------------------
   * Template rendering logic
   * ----------------------------------------
   */

  getMeasurementsFormGroups(): FormGroup[] {
    const formArray = this.foodForm.get('measurements') as FormArray;
    return formArray.controls.map(c => c as FormGroup);
  }

  getUnitsOfType(unitType: UnitTypeEnum): UnitEnum[] {
    return this.unitHelperService.getUnitsOfType(unitType, this.units);
  }

  brandingSectionHasError(): boolean {
    return [
      this.foodForm.get('name'),
      this.foodForm.get('brand'),
      this.foodForm.get('styleOrFlavor')
    ].some(ctrl => this.shouldShowError(ctrl));
  }

  servingSizeSectionHasError(): boolean {
    return this.shouldShowError(this.foodForm.get('measurements'));
  }

  nutritionSectionHasError(): boolean {
    return [
      this.foodForm.get('calories'),
      this.foodForm.get('fat'),
      this.foodForm.get('carbs'),
      this.foodForm.get('protein')
    ].some(ctrl => this.shouldShowError(ctrl));
  }

  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadFood(): void {
    if (this.createMode) {
      this.foodFormBuilt$.subscribe(() => {
        this.food = this.foodHelperService.getEmptyFood();
        this.loading = false;
      });
    } else {
      this.foodApiService.get(this.foodId).subscribe(
        food => {
          this.food = food;
          this.populateFormDataWithApiModel();
        },
        (error) => { this.snackBarService.showError(); });
    }
  }

  private populateFormDataWithApiModel(): void {
    this.foodFormBuilt$.subscribe(() => {
      // load food data into form controls
      this.foodForm.patchValue({
        name: this.food.name,
        brand: this.food.brand,
        styleOrFlavor: this.food.styleOrFlavor,
        calories: this.food.calories,
        fat: this.food.fat,
        carbs: this.food.carbs,
        protein: this.food.protein,
        // measurements set seperately
      });

      // empty default, then load existing measurements
      this.foodForm.setControl('measurements', new FormArray([]));
      this.foodForm.get('measurements').setValidators(Validators.required);
      this.food.measurements.forEach(mmt => {
        const mmtCtrlArray = this.foodForm.get('measurements') as FormArray;
        mmtCtrlArray.push(this.fb.group({
          amount: [mmt.amount],
          unitType: [mmt.unit.unitType],
          unit: [mmt.unit.unit],
        }));
      });

      this.loading = false;
    });
  }

  private populateApiModelWithFormData(): void {
    // shorten for readability
    const f = this.food;
    const ff = this.foodForm;

    f.name = ff.get('name').value;
    f.brand = ff.get('brand').value;
    f.styleOrFlavor = ff.get('styleOrFlavor').value;
    f.calories = ff.get('calories').value;
    f.fat = ff.get('fat').value;
    f.carbs = ff.get('carbs').value;
    f.protein = ff.get('protein').value;

    const apiMmts: Measurement[] = [];
    const formMmts = ff.get('measurements') as FormArray;
    formMmts.controls.forEach(formMmt => {
      const apiMmt: Measurement = {
        amount: formMmt.get('amount').value,
        unit: this.unitHelperService.getUnitModelByEnum(formMmt.get('unit').value, this.units)
      };

      apiMmts.push(apiMmt);
    });

    f.measurements = apiMmts;
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
      measurements: this.fb.array(
        [
          this.buildDefaultMeasurement(),
        ],
        {
          validators: Validators.required
        }
      )
    });

    this.foodFormBuilt$.next(true);
  }

  private buildDefaultMeasurement(): FormGroup {
    return this.fb.group({
      amount: [1],
      unitType: [UnitTypeEnum.VOLUME],
      unit: [UnitEnum.CUP]
    });
  }

  private shouldShowError(ctrl: AbstractControl): boolean {
    return (!ctrl.valid) && (ctrl.touched);
  }

}
