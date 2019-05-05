import { Injectable } from '@angular/core';
import { MacroService } from 'src/app/services/macro.service';
import { MacroEnum } from '../enums/macro.enum';
import { Ingredient } from '../models/api/ingredient.model';
import { Plan } from '../models/api/plan.model';
import { Plate } from '../models/api/plate.model';
import { HelperDishService } from './helper-dish.service';
import { HelperFoodService } from './helper-food.service';

@Injectable({
  providedIn: 'root'
})
export class HelperPlanService {

  constructor(private helperDishService: HelperDishService, private helperFoodService: HelperFoodService, private macroService: MacroService) { }

  /**
   * Calculate the total calories in a plan
   * @param plan the plan
   */
  public calcCalories(plan: Plan): number {
    const plateCals = plan.plates
      .map<number>(plate => this.calcPlateCalories(plate))
      .reduce((caloriesSum, plateCalories) => caloriesSum + plateCalories);

    const ingredientCals = plan.ingredients
      .map<number>(ingredient => this.helperDishService.calcIngredientCalories(ingredient))
      .reduce((caloriesSum, ingredientCalories) => caloriesSum + ingredientCalories);

    return plateCals + ingredientCals;
  }

  /**
   * Calculates the number of grams of a particular macro are included in a plan
   * @param plan the plan
   * @param macro the macro in question
   */
  public calcIndividualMacro(plan: Plan, macro: MacroEnum) {
    const gramsFromPlates = plan.plates
      .map<number>(plate => this.calcGramsOfMacroInPlate(plate, macro))
      .reduce((gramsSum, plateGrams) => gramsSum + plateGrams);

    const gramsFromIngredients = plan.ingredients
      .map<number>(ingredient => this.calcGramsOfMacroInIngredient(ingredient, macro))
      .reduce((gramsSum, ingredientGrams) => gramsSum + ingredientGrams);

    return gramsFromPlates + gramsFromIngredients;
  }

  /**
   * Calculate the percentage of calories a particular ingredient contributes to a plan
   * @param ingredient the ingredient
   * @param plan the plan
   */
  public calcIngredientCaloriesPercentage(ingredient: Ingredient, plan: Plan): number {
    return 100 * this.helperDishService.calcIngredientCalories(ingredient) / this.calcCalories(plan);
  }

  /**
   * Calculate the percentage of calories a particular plate contributes to a plan
   * @param plate the plate
   * @param plan the plan
   */
  public calcPlateCaloriesPercentage(plate: Plate, plan: Plan): number {
    return 100 * this.calcPlateCalories(plate) / this.calcCalories(plan);
  }

  /**
   * Calculate the percentage of calories a particular macro nutrient in a particular plate contributes to a plan
   * @param plate the plate
   * @param macro the macro nutrient
   * @param plan the dish
   */
  public calcPlateMacroCaloriesPercentage(plate: Plate, macro: MacroEnum, plan: Plan): number {
    return 100
      * this.macroService.macroToCalories(this.calcGramsOfMacroInPlate(plate, macro), macro)
      / this.calcCalories(plan);
  }

  /**
   * Calculate the percentage of calories a particular macro nutrient in a particular ingredient contributes to a plan
   * @param ingredient the ingredient
   * @param macro the macro nutrient
   * @param plan the dish
   */
  public calcIngredientMacroCaloriesPercentage(ingredient: Ingredient, macro: MacroEnum, plan: Plan): number {
    return 100
      * this.macroService.macroToCalories(this.calcGramsOfMacroInIngredient(ingredient, macro), macro)
      / this.calcCalories(plan);
  }

  /**
   * Calculates the number of grams of a particular macro nutrient present in a plate
   * @param plate the plate
   * @param macro the macro nutrient
   */
  public calcGramsOfMacroInPlate(plate: Plate, macro: MacroEnum): number {
    return this.helperDishService.calcMacro(plate.dish, macro) * this.calcPlateAmountToDishServingSizeRatio(plate);
  }

  /**
   * Calculates the number of grams of a particular macro nutrient present in an ingredient
   * @param ingredient the ingredient
   * @param macro the macro nutrient
   */
  public calcGramsOfMacroInIngredient(ingredient: Ingredient, macro: MacroEnum): number {
    return this.helperFoodService.getMacro(ingredient.food, macro) * this.calcIngredientAmountToFoodServingSizeRatio(ingredient);
  }


  /**
   * Calculate the number of calories in a plate as the sum of its dish's macro nutrient values
   * @param plate the plate
   */
  public calcPlateCalories(plate: Plate): number {
    const calsIn1DishServing = this.helperDishService.calcCalories(plate.dish);
    return calsIn1DishServing * this.calcPlateAmountToDishServingSizeRatio(plate);
  }

  /**
   * Calculates the ratio between the plate amount (how much of the dish is being served) and the dish serving size.
   * This ratio abstraction is useful for getting the number of calories for a plate
   * because a plate is really an amount of a dish.
   * 
   * Handles unit conversion too.
   * 
   * Very similar to  calcIngredientAmountToFoodServingSizeRatio()
   * @param plate the plate for which the ratio will be used
   */
  private calcPlateAmountToDishServingSizeRatio(plate: Plate): number {
    const compatibleDishServingSize = plate.dish.measurements.find(mmt => mmt.unit.unitType === plate.measurement.unit.unitType);
    return (
      (plate.measurement.amount * plate.measurement.unit.unitTypeRatio)
      /
      (compatibleDishServingSize.amount * compatibleDishServingSize.unit.unitTypeRatio)
    );
  }

  /**
   * Calculates the ratio between the ingredient amount (how much of the food is being served) and the food serving size.
   * This ratio abstraction is useful for getting the number of a grams for a particular macro for an ingredient
   * because an ingredient is really an amount of a food.
   * 
   * Handles unit conversion too.
   * 
   * Very similar to  calcPlateAmountToDishServingSizeRatio()
   * @param plate the plate for which the ratio will be used
   */
  private calcIngredientAmountToFoodServingSizeRatio(ingredient: Ingredient): number {
    const compatibleFoodServingSize = ingredient.food.measurements.find(mmt => mmt.unit.unitType === ingredient.measurement.unit.unitType);
    return (
      (ingredient.measurement.amount * ingredient.measurement.unit.unitTypeRatio)
      /
      (compatibleFoodServingSize.amount * compatibleFoodServingSize.unit.unitTypeRatio)
    );
  }



}
