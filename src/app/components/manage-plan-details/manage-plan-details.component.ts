import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { UnitTypeEnum } from 'src/app/enums/unit-type.enum';
import { UnitEnum } from 'src/app/enums/unit.enum';
import { Dish } from 'src/app/models/api/dish.model';
import { Food } from 'src/app/models/api/food.model';
import { Plan } from 'src/app/models/api/plan.model';
import { Plate } from 'src/app/models/api/plate.model';
import { Unit } from 'src/app/models/api/unit.model';
import { PlanItem } from 'src/app/models/plan-item.model';
import { DishApiService } from 'src/app/services/api/dish-api.service';
import { FoodApiService } from 'src/app/services/api/food-api.service';
import { UnitApiService } from 'src/app/services/api/unit-api.service';
import { UnitHelperService } from 'src/app/services/model-helper/unit-helper.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Ingredient } from './../../models/api/ingredient.model';
import { PlanApiService } from './../../services/api/plan-api.service';
import { HeadingService } from './../../services/heading.service';
import { PlanHelperService } from './../../services/model-helper/plan-helper.service';

@Component({
  selector: 'app-manage-plan-details',
  templateUrl: './manage-plan-details.component.html',
  styleUrls: ['./manage-plan-details.component.scss']
})
export class ManagePlanDetailsComponent implements OnInit {
  planId: number;
  idLoaded$ = new ReplaySubject();
  createMode = false;

  // api results
  plan: Plan;
  planLoaded$ = new ReplaySubject();

  filteredPlanItems: PlanItem[];

  foods: Food[];
  foodsLoaded$ = new ReplaySubject();

  dishes: Dish[];
  dishesLoaded$ = new ReplaySubject();

  units: Unit[];
  unitsLoaded$ = new ReplaySubject<boolean>();

  // form controls
  planForm: FormGroup;
  planFormBuilt$ = new ReplaySubject();

  // loading
  loading = true;

  constructor(
    private headingService: HeadingService,
    private route: ActivatedRoute,
    private router: Router,
    private planApiService: PlanApiService,
    private planHelperService: PlanHelperService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private location: Location,
    private dialog: MatDialog,
    private foodApiService: FoodApiService,
    private dishApiService: DishApiService,
    private unitHelperService: UnitHelperService,
    private unitApiService: UnitApiService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Plans');

    // Set loading = false once nessesary data is loaded
    forkJoin([
      // this.idLoaded$.pipe(first()), // <-- first() completes once a single value has been emitted
      // this.planLoaded$.pipe(first())
      this.planFormBuilt$.pipe(first())
    ]).subscribe(() => {
      this.loading = false;
      console.log(this.planForm.get('planItems'));
    });

    // load plan id
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.get('id') === 'create') {
        this.createMode = true;
      } else {
        this.planId = +paramMap.get('id'); // <-- convert to number
      }

      this.idLoaded$.next();
    });

    // load units
    this.unitApiService.getUnits().subscribe(
      units => {
        this.units = units;
        this.unitsLoaded$.next(true);
      }, (error) => {
        this.snackBarService.showError();
      });

    // load foods
    this.foodApiService.list('', 'name', SortDirectionEnum.ASC).subscribe(foods => {
      this.foods = foods;
      this.foodsLoaded$.next();
    });

    // load dishes
    this.dishApiService.list('', 'name', SortDirectionEnum.ASC).subscribe(dishes => {
      this.dishes = dishes;
      this.dishesLoaded$.next();
    });

    // load plan
    this.idLoaded$.subscribe(() => {
      this.loadPlan();
    });

    // build form
    this.planLoaded$.subscribe(() => {
      this.populateFormDataWithApiModel();
    });


  }

  /**
   * ----------------------------------------
   * User Input
   * ----------------------------------------
   */
  onClickDeletePlan(): void {
    const dialog = this.dialog.open(DialogComponent, {
      data: {
        title: `Delete plan?`,
        content: 'This action cannot be undone.',
        cancel: 'Nevermind',
        confirm: 'Yes, Delete'
      }
    });
    dialog.afterClosed().subscribe(doDelete => {
      if (doDelete) {
        this.onConfirmDeletePlan();
      }
    });
  }

  onConfirmDeletePlan(): void {
    this.planApiService.delete(this.planId).subscribe(
      () => {
        this.snackBarService.showSuccess(`Successfully deleted plan`);
        this.router.navigate(['manage-plans']);
      },
      (error) => {
        this.snackBarService.showError(`Something went wrong. Could not delete plan.`);
      });
  }

  onClickCancel(): void {
    this.location.back();
  }

  onClickAddPlanItem(): void {
    const planItemsFormArray = this.planForm.get('planItems') as FormArray;
    planItemsFormArray.push(this.buildDefaultPlanItem());
    planItemsFormArray.markAsTouched();

    this.bindPlanItemSelectFilterActions();
  }

  onClickDeletePlanItem(index: number): void {
    const planItemsFormArray = this.planForm.get('planItems') as FormArray;
    planItemsFormArray.removeAt(index);
    planItemsFormArray.markAsTouched();
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      this.populateApiModelWithFormData();

      if (this.createMode) {
        this.planApiService.create(this.plan).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully created plan`);
            this.router.navigate(['manage-plans']);
          }, (error) => {
            this.snackBarService.showError(`Something went wrong. Could not create plan.`);
          });
      } else {
        this.planApiService.update(this.plan).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully updated plan`);
            this.router.navigate(['manage-plans']);
          },
          (error) => {
            this.snackBarService.showError(`Something went wrong. Could not update plan.`);
          });
      }

    } else {
      // TODO: let user know
    }
  }

  // clear value of unit select and mark touched so validation kicks in
  onPlanItemChange(index: number): void {
    const unitCtrl = this.planForm.get(['planItems', index, 'measurement', 'unitType']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();

    this.onPlanItemMeasurementUnitTypeChange(index);
  }

  // clear value of unit select and mark touched so validation kicks in
  onPlanItemMeasurementUnitTypeChange(index: number): void {
    const unitCtrl = this.planForm.get(['planItems', index, 'measurement', 'unit']);
    unitCtrl.setValue(null);
    unitCtrl.markAsTouched();
  }

  /**
   * ----------------------------------------
   * Template rendering logic
   * ----------------------------------------
   */

  getPlanItemsFormGroups(): FormGroup[] {
    const formArray = this.planForm.get('planItems') as FormArray;
    return formArray.controls.map(c => c as FormGroup);
  }

  planItemsSectionHasError(): boolean {
    return this.shouldShowError(this.planForm.get('planItems'));
  }

  getUnitsOfType(unitType: UnitTypeEnum): UnitEnum[] {
    return this.unitHelperService.getUnitsOfType(unitType, this.units);
  }

  getUnitTypesForPlanItem(index: number): UnitTypeEnum[] {
    const planItemCtrl = this.planForm.get(['planItems', index]);
    const planItemId = planItemCtrl.get('id').value;
    if (this.planItemIsAFood(planItemId)) {
      return this.foods.find(food => food.id === this.modelIdFromPlanItemId(planItemId))
        .measurements.map(mmt => mmt.unit.unitType);
    } else if (this.planItemIsADish(planItemId)) {
      return this.dishes.find(dish => dish.id === this.modelIdFromPlanItemId(planItemId))
        .measurements.map(mmt => mmt.unit.unitType);
    }
    return [];
  }

  getDropdownLabelForPlanItem(planItem: PlanItem): string {
    if (this.planItemIsAFood(planItem.id)) {
      const food = planItem.item as Food;
      return `${food.name}` +
        `${food.styleOrFlavor ? ' - ' + food.styleOrFlavor : ''}` +
        `${food.brand ? ' (' + food.brand + ')' : ''}`;
    } else if (this.planItemIsADish(planItem.id)) {
      const dish = planItem.item as Dish;
      return `${dish.name}`;
    }
    return null;
  }

  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadPlan(): void {
    if (this.createMode) {
      this.plan = this.planHelperService.getEmptyPlan();
      this.planLoaded$.next();
    } else {
      this.planApiService.get(this.planId).subscribe(plan => {
        this.plan = plan;
        this.planLoaded$.next();
      });
    }
  }

  private populateFormDataWithApiModel(): void {
    this.planForm = this.buildDefaultForm();

    this.planForm.patchValue({
      calories: this.plan.calories,
      fat: this.plan.fat,
      carbs: this.plan.carbs,
      protein: this.plan.protein
    });

    // empty default, then load existing plan items (ingredients and plates combined)
    this.planForm.setControl('planItems', new FormArray([]));

    // add ingredients as plan items
    this.plan.ingredients.forEach(ingredient => {
      const planItemsCtrlArray = this.planForm.get('planItems') as FormArray;
      planItemsCtrlArray.push(this.fb.group({
        id: [this.planItemIdFromFood(ingredient.food)],
        filter: [''],
        measurement: this.fb.group({
          amount: [ingredient.measurement.amount],
          unitType: [ingredient.measurement.unit.unitType],
          unit: [ingredient.measurement.unit.unit]
        })
      }));
    });

    // add plates as plan items
    this.plan.plates.forEach(plate => {
      const planItemsCtrlArray = this.planForm.get('planItems') as FormArray;
      planItemsCtrlArray.push(this.fb.group({
        id: [this.planItemIdFromDish(plate.dish)],
        filter: [''],
        measurement: this.fb.group({
          amount: [plate.measurement.amount],
          unitType: [plate.measurement.unit.unitType],
          unit: [plate.measurement.unit.unit]
        })
      }));
    });

    forkJoin([
      this.foodsLoaded$.pipe(first()),
      this.dishesLoaded$.pipe(first())
    ]).subscribe(() => {
      this.filterPlanItems('');
      this.bindPlanItemSelectFilterActions();
      this.planFormBuilt$.next();
    });
  }

  private populateApiModelWithFormData(): void {
    // shorten for readability
    const p = this.plan;
    const pf = this.planForm;

    p.calories = pf.get('calories').value;
    p.fat = pf.get('fat').value;
    p.carbs = pf.get('carbs').value;
    p.protein = pf.get('protein').value;

    const planItems = pf.get('planItems') as FormArray;

    // populate ingredients from plan items
    const apiIngredients: Ingredient[] = [];
    const formIngredients = planItems.controls.filter(itemCtrl => this.planItemIsAFood(itemCtrl.get('id').value));
    formIngredients.forEach(formIngredient => {
      const apiIngredient: Ingredient = {
        food: this.foods.find(food => food.id === this.modelIdFromPlanItemId(formIngredient.get('id').value)),
        measurement: {
          amount: formIngredient.get(['measurement', 'amount']).value,
          unit: this.unitHelperService.getUnitModelByEnum(formIngredient.get(['measurement', 'unit']).value, this.units)
        },
        isTemplate: true
      };
      apiIngredients.push(apiIngredient);
    });
    p.ingredients = apiIngredients;

    // populate plates from plan items
    const apiPlates: Plate[] = [];
    const formPlates = planItems.controls.filter(itemCtrl => this.planItemIsADish(itemCtrl.get('id').value));
    formPlates.forEach(formPlate => {
      const apiPlate: Plate = {
        dish: this.dishes.find(dish => dish.id === this.modelIdFromPlanItemId(formPlate.get('id').value)),
        measurement: {
          amount: formPlate.get(['measurement', 'amount']).value,
          unit: this.unitHelperService.getUnitModelByEnum(formPlate.get(['measurement', 'unit']).value, this.units)
        },
        isTemplate: true
      };
      apiPlates.push(apiPlate);
    });
    p.plates = apiPlates;
  }

  private buildDefaultForm(): FormGroup {
    return this.fb.group({
      calories: [null],
      fat: [null],
      carbs: [null],
      protein: [null],
      ingredients: this.fb.array([]),
      plates: this.fb.array([])
    });
  }

  private buildDefaultPlanItem(): FormGroup {
    return this.fb.group({
      id: [null],
      filter: [''],
      measurement: this.buildDefaultMeasurement()
    });
  }

  private buildDefaultMeasurement(): FormGroup {
    return this.fb.group({
      amount: [null],
      unitType: [null],
      unit: [null]
    });
  }

  private bindPlanItemSelectFilterActions(): void {
    const planItemsFormArray = this.planForm.get(['planItems']) as FormArray;
    planItemsFormArray.controls.forEach(planItemCtrl => {
      const filterCtrl = planItemCtrl.get(['filter']);
      filterCtrl.valueChanges.subscribe(() => {
        this.filterPlanItems(filterCtrl.value);
      });
    });
  }

  private filterPlanItems(value: string): void {
    this.filteredPlanItems = [];

    // Add foods that match filter as plan items
    this.foods.filter(food =>
      this.valueInField(value, food.name) ||
      this.valueInField(value, food.styleOrFlavor) ||
      this.valueInField(value, food.brand)
    ).forEach(food => {
      const planItem: PlanItem = {
        id: this.planItemIdFromFood(food),
        item: food
      };
      this.filteredPlanItems.push(planItem);
    });

    // Add dishes that match filter as plan items
    this.dishes.filter(dish =>
      // TODO: Maybe also match on any nested food fields?
      this.valueInField(value, dish.name)
    ).forEach(dish => {
      const planItem: PlanItem = {
        id: this.planItemIdFromDish(dish),
        item: dish
      };
      this.filteredPlanItems.push(planItem);
    });
  }

  private valueInField(value: string, fieldValue: string): boolean {
    return fieldValue && fieldValue.toLowerCase().includes(value.toLowerCase());
  }

  private shouldShowError(ctrl: AbstractControl): boolean {
    return (!ctrl.valid) && (ctrl.touched);
  }

  private planItemIdFromFood(food: Food): string {
    return 'f' + food.id;
  }

  private planItemIdFromDish(dish: Dish): string {
    return 'd' + dish.id;
  }

  private modelIdFromPlanItemId(planItemId: string): number {
    return Number(planItemId.replace(/[fd]/, ''));
  }

  private planItemIsAFood(planItemId: string): boolean {
    return planItemId ? planItemId.slice(0, 1) === 'f' : false;
  }

  private planItemIsADish(planItemId: string): boolean {
    return planItemId ? planItemId.slice(0, 1) === 'd' : false;
  }

}
