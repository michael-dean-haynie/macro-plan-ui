import { Injectable } from '@angular/core';
import { MacroEnum } from '../enums/macro.enum';
import { Plan } from '../models/api/plan.model';
import { Plate } from '../models/api/plate.model';
import { BreakdownItem } from '../models/breakdown-item.model';
import { Dish } from './../models/api/dish.model';
import { Ingredient } from './../models/api/ingredient.model';
import { MacroService } from './macro.service';
import { DishHelperService } from './model-helper/dish-helper.service';
import { PlanHelperService } from './model-helper/plan-helper.service';

@Injectable({
  providedIn: 'root'
})
export class BreakdownService {

  constructor(
    private dishHelperService: DishHelperService,
    private macroService: MacroService,
    private planHelperService: PlanHelperService) { }

  /**
   * Create a BreakdownItem of an Ingredient for use in a Dish breakdown table
   * @param ingredient the ingredient to be converted
   * @param dish the dish that the breakdown tabel will describe
   */
  public convertIngredientForDish(ingredient: Ingredient, dish: Dish): BreakdownItem {
    // fat
    const fat = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.dishHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.FAT, dish);

    // carbs
    const carbs = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.dishHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.CARBS, dish);

    // protein
    const protein = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage =
      this.dishHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.PROTEIN, dish);

    const breakdownItem: BreakdownItem = {
      name: ingredient.food.name,
      measurement: [ingredient.measurement],

      // calories
      calories: this.dishHelperService.calcIngredientCalories(ingredient),
      caloriesPercentage: this.dishHelperService.calcIngredientCaloriesPercentage(ingredient, dish),

      // fat
      fat,
      fatCalories,
      fatPercentage,

      // carbs
      carbs,
      carbsCalories,
      carbsPercentage,

      // protein
      protein,
      proteinCalories,
      proteinPercentage,
    };

    return breakdownItem;
  }

  // TODO: refactor these 3 methods maybe dry stuff up?
  public convertIngredientForPlan(ingredient: Ingredient, plan: Plan): BreakdownItem {
    // fat
    const fat = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.planHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.FAT, plan);

    // carbs
    const carbs = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.planHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.CARBS, plan);

    // protein
    const protein = this.dishHelperService.calcIngredientIndividualMacro(ingredient, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage = this.planHelperService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.PROTEIN, plan);

    const breakdownItem: BreakdownItem = {
      name: ingredient.food.name,
      measurement: [ingredient.measurement],

      // calories
      calories: this.dishHelperService.calcIngredientCalories(ingredient),
      caloriesPercentage: this.planHelperService.calcIngredientCaloriesPercentage(ingredient, plan),

      // fat
      fat,
      fatCalories,
      fatPercentage,

      // carbs
      carbs,
      carbsCalories,
      carbsPercentage,

      // protein
      protein,
      proteinCalories,
      proteinPercentage,
    };

    return breakdownItem;
  }

  public convertPlateForPlan(plate: Plate, plan: Plan): BreakdownItem {
    // fat
    const fat = this.planHelperService.calcGramsOfMacroInPlate(plate, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.planHelperService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.FAT, plan);

    // carbs
    const carbs = this.planHelperService.calcGramsOfMacroInPlate(plate, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.planHelperService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.CARBS, plan);

    // protein
    const protein = this.planHelperService.calcGramsOfMacroInPlate(plate, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage = this.planHelperService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.PROTEIN, plan);

    const breakdownItem: BreakdownItem = {
      name: plate.dish.name,
      measurement: [plate.measurement],

      // calories
      calories: this.planHelperService.calcPlateCalories(plate),
      caloriesPercentage: this.planHelperService.calcPlateCaloriesPercentage(plate, plan),

      // fat
      fat,
      fatCalories,
      fatPercentage,

      // carbs
      carbs,
      carbsCalories,
      carbsPercentage,

      // protein
      protein,
      proteinCalories,
      proteinPercentage,
    };

    return breakdownItem;
  }
}
