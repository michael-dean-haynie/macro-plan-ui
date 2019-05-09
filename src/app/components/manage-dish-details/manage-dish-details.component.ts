import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { UnitTypeEnum } from 'src/app/enums/unit-type.enum';
import { Food } from 'src/app/models/api/food.model';
import { Ingredient } from 'src/app/models/api/ingredient.model';
import { Measurement } from 'src/app/models/api/measurement.model';
import { Unit } from 'src/app/models/api/unit.model';
import { DishApiService } from 'src/app/services/api/dish-api.service';
import { UnitApiService } from 'src/app/services/api/unit-api.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { FoodApiService } from '../../services/api/food-api.service';
import { DishHelperService } from '../../services/model-helper/dish-helper.service';
import { UnitHelperService } from '../../services/model-helper/unit-helper.service';
import { DialogComponent } from '../dialog/dialog.component';
import { UnitEnum } from './../../enums/unit.enum';
import { Dish } from './../../models/api/dish.model';
import { HeadingService } from './../../services/heading.service';

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

  foods: Food[];
  filteredFoods: Food[];
  foodsLoaded$ = new ReplaySubject<boolean>(); // <-- will emit a value when foods are loaded

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
    private foodApiService: FoodApiService,
    private dishApiService: DishApiService,
    private unitApiService: UnitApiService,
    private unitHelperService: UnitHelperService,
    private dishHelperService: DishHelperService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private headingService: HeadingService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Dishes');

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

    // load dish id
    this.route.params.subscribe(params => {
      if (params['id'] === 'create') {
        this.createMode = true;
      } else {
        this.dishId = +params['id']; // <-- convert to number
      }

      this.idLoaded$.next(true); // <-- emit value indicating id has been
    });

    // load foods
    this.foodApiService.list('', 'name', SortDirectionEnum.ASC).subscribe(foods => {
      this.foods = foods;
      this.filteredFoods = foods;
      this.foodsLoaded$.next(true);
    });

    // load dish
    this.idLoaded$.subscribe(() => {
      this.loadDish();
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
    this.dishApiService.delete(this.dishId).subscribe(
      () => {
        this.snackBarService.showSuccess(`Successfully deleted "${this.dish.name}"`);
        this.router.navigate(['manage-dishes']);
      },
      (error) => {
        this.snackBarService.showError(`Something went wrong. Could not delete "${this.dish.name}"`);
      });
  }

  // clear value of unit select and mark touched so validation kicks in
  onDishMeasurementUnitTypeChange(index: number): void {
    const unitCtrl = this.dishForm.get(['measurements', index, 'unit']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();
  }

  // clear value of unit select and mark touched so validation kicks in
  onIngredientMeasurementUnitTypeChange(index: number): void {
    const unitCtrl = this.dishForm.get(['ingredients', index, 'measurement', 'unit']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();
  }

  // clear value of unit select and mark touched so validation kicks in
  onIngredientFoodChange(index: number): void {
    const unitCtrl = this.dishForm.get(['ingredients', index, 'measurement', 'unitType']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();

    this.onIngredientMeasurementUnitTypeChange(index);
  }

  onClickDeleteDishMeasurement(index: number): void {
    const measurementsFormArray = this.dishForm.get('measurements') as FormArray;
    measurementsFormArray.removeAt(index);
    measurementsFormArray.markAsTouched();
  }

  onClickDeleteIngredient(index: number): void {
    const measurementsFormArray = this.dishForm.get('ingredients') as FormArray;
    measurementsFormArray.removeAt(index);
    measurementsFormArray.markAsTouched();
  }

  onClickAddDishMeasurement(): void {
    const measurementsFormArray = this.dishForm.get('measurements') as FormArray;
    measurementsFormArray.push(this.buildDefaultMeasurement());
    measurementsFormArray.markAsTouched();
  }

  onClickAddIngredient(): void {
    const measurementsFormArray = this.dishForm.get('ingredients') as FormArray;
    measurementsFormArray.push(this.buildDefaultIngredient());
    measurementsFormArray.markAsTouched();

    this.bindFoodSelectFilterActions();
  }

  onSubmit(): void {
    if (this.dishForm.valid) {
      this.populateApiModelWithFormData();

      if (this.createMode) {
        this.dishApiService.create(this.dish).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully created "${this.dish.name}"`);
            this.router.navigate(['manage-dishes']);
          }, (error) => {
            this.snackBarService.showError(`Something went wrong. Could not create "${this.dish.name}"`);
          });
      } else {
        this.dishApiService.update(this.dish).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully updated "${this.dish.name}"`);
            this.router.navigate(['manage-dishes']);
          },
          (error) => {
            this.snackBarService.showError(`Something went wrong. Could not update "${this.dish.name}"`);
          });
      }

    } else {
      // TODO: let user know
    }
  }

  /**
   * ----------------------------------------
   * Template rendering logic
   * ----------------------------------------
   */

  getDishMeasurementsFormGroups(): FormGroup[] {
    const formArray = this.dishForm.get('measurements') as FormArray;
    return formArray.controls.map(c => c as FormGroup);
  }

  getIngredientsFormGroups(): FormGroup[] {
    const formArray = this.dishForm.get('ingredients') as FormArray;
    return formArray.controls.map(c => c as FormGroup);
  }

  getUnitsOfType(unitType: UnitTypeEnum): UnitEnum[] {
    return this.unitHelperService.getUnitsOfType(unitType, this.units);
  }

  getUnitTypesForFood(foodId: number): UnitTypeEnum[] {
    const food = this.foods.find(f => f.id === foodId);
    if (!food) {
      return [];
    }
    return food.measurements.map(mmt => mmt.unit.unitType);
  }

  servingSizeSectionHasError(): boolean {
    return this.shouldShowError(this.dishForm.get('measurements'));
  }

  ingredientsSectionHasError(): boolean {
    return this.shouldShowError(this.dishForm.get('ingredients'));
  }


  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadDish(): void {
    if (this.createMode) {
      this.dishFormBuilt$.subscribe(() => {
        this.dish = this.dishHelperService.getEmptyDish();
        this.bindFoodSelectFilterActions();
        this.foodsLoaded$.subscribe(() => {
          this.loading = false;
        });
      });
    } else {
      this.dishApiService.get(this.dishId).subscribe(
        dish => {
          this.dish = dish;
          this.populateFormDataWithApiModel();
          this.bindFoodSelectFilterActions();
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
          foodFilter: [''],
          measurement: this.fb.group({
            amount: [ingredient.measurement.amount],
            unitType: [ingredient.measurement.unit.unitType],
            unit: [ingredient.measurement.unit.unit]
          })
        }));
      });

      this.foodsLoaded$.subscribe(() => {
        this.loading = false;
      });
    });
  }

  private populateApiModelWithFormData(): void {
    // shorten for readability
    const d = this.dish;
    const df = this.dishForm;

    d.name = df.get('name').value;

    // populate dish serving size measurements
    const apiMmts: Measurement[] = [];
    const formMmts = df.get('measurements') as FormArray;
    formMmts.controls.forEach(formMmt => {
      const apiMmt: Measurement = {
        amount: formMmt.get('amount').value,
        unit: this.unitHelperService.getUnitModelByEnum(formMmt.get('unit').value, this.units)
      };
      apiMmts.push(apiMmt);
    });
    d.measurements = apiMmts;

    // populate dish ingredients
    const apiIngredients: Ingredient[] = [];
    const formIngredients = df.get('ingredients') as FormArray;
    formIngredients.controls.forEach(formIngredient => {
      const apiIngredient: Ingredient = {
        food: this.foods.find(food => food.id === formIngredient.get('foodId').value),
        measurement: {
          amount: formIngredient.get(['measurement', 'amount']).value,
          unit: this.unitHelperService.getUnitModelByEnum(formIngredient.get(['measurement', 'unit']).value, this.units)
        },
        isTemplate: true
      };
      apiIngredients.push(apiIngredient);
    });
    d.ingredients = apiIngredients;
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
      amount: [null],
      unitType: [null],
      unit: [null]
    });
  }

  private buildDefaultIngredient(): FormGroup {
    return this.fb.group({
      foodId: [null],
      foodFilter: [''],
      measurement: this.buildDefaultMeasurement()
    });
  }

  private bindFoodSelectFilterActions(): void {
    const ingredientsFormArray = this.dishForm.get(['ingredients']) as FormArray;
    ingredientsFormArray.controls.forEach(ingredientCtrl => {
      const filterCtrl = ingredientCtrl.get(['foodFilter']);
      filterCtrl.valueChanges.subscribe(() => {
        this.filterFoods(filterCtrl.value);
      });
    });
  }

  private filterFoods(value: string): void {
    this.filteredFoods = this.foods.filter(f => f.name.toLowerCase().includes(value.toLowerCase()));
  }

  private shouldShowError(ctrl: AbstractControl): boolean {
    return (!ctrl.valid) && (ctrl.touched);
  }

}
