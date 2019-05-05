import { Injectable } from '@angular/core';
import { MacroEnum } from '../enums/macro.enum';
import { Plan } from '../models/api/plan.model';
import { Plate } from '../models/api/plate.model';
import { BreakdownItem } from '../models/breakdown-item.model';
import { Dish } from './../models/api/dish.model';
import { Ingredient } from './../models/api/ingredient.model';
import { HelperDishService } from './helper-dish.service';
import { HelperPlanService } from './helper-plan.service';
import { MacroService } from './macro.service';

@Injectable({
  providedIn: 'root'
})
export class BreakdownService {

  constructor(
    private helperDishService: HelperDishService,
    private macroService: MacroService,
    private helperPlanService: HelperPlanService) { }

  /**
   * Create a BreakdownItem of an Ingredient for use in a Dish breakdown table
   * @param ingredient the ingredient to be converted
   * @param dish the dish that the breakdown tabel will describe
   */
  public convertIngredientForDish(ingredient: Ingredient, dish: Dish): BreakdownItem {
    // fat
    const fat = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.FAT, dish);

    // carbs
    const carbs = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.CARBS, dish);

    // protein
    const protein = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage =
      this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.PROTEIN, dish);

    const breakdownItem: BreakdownItem = {
      name: ingredient.food.name,
      measurement: [ingredient.measurement],

      // calories
      calories: this.helperDishService.calcIngredientCalories(ingredient),
      caloriesPercentage: this.helperDishService.calcIngredientCaloriesPercentage(ingredient, dish),

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

  //TODO: refactor these 3 methods maybe dry stuff up?
  public convertIngredientForPlan(ingredient: Ingredient, plan: Plan): BreakdownItem {
    // fat
    const fat = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.helperPlanService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.FAT, plan);

    // carbs
    const carbs = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.helperPlanService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.CARBS, plan);

    // protein
    const protein = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage = this.helperPlanService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.PROTEIN, plan);

    const breakdownItem: BreakdownItem = {
      name: ingredient.food.name,
      measurement: [ingredient.measurement],

      // calories
      calories: this.helperDishService.calcIngredientCalories(ingredient),
      caloriesPercentage: this.helperPlanService.calcIngredientCaloriesPercentage(ingredient, plan),

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
    const fat = this.helperPlanService.calcGramsOfMacroInPlate(plate, MacroEnum.FAT);
    const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
    const fatPercentage = this.helperPlanService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.FAT, plan);

    // carbs
    const carbs = this.helperPlanService.calcGramsOfMacroInPlate(plate, MacroEnum.CARBS);
    const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
    const carbsPercentage = this.helperPlanService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.CARBS, plan);

    // protein
    const protein = this.helperPlanService.calcGramsOfMacroInPlate(plate, MacroEnum.PROTEIN);
    const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
    const proteinPercentage = this.helperPlanService.calcPlateMacroCaloriesPercentage(plate, MacroEnum.PROTEIN, plan);

    const breakdownItem: BreakdownItem = {
      name: plate.dish.name,
      measurement: [plate.measurement],

      // calories
      calories: this.helperPlanService.calcPlateCalories(plate),
      caloriesPercentage: this.helperPlanService.calcPlateCaloriesPercentage(plate, plan),

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
