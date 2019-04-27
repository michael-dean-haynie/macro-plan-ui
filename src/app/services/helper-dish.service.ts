import { Injectable } from '@angular/core';
import { Dish } from '../models/api/dish.model';
import { Ingredient } from '../models/api/ingredient.model';
import { MacroEnum } from './../enums/macro.enum';
import { HelperFoodService } from './helper-food.service';
import { MacroService } from './macro.service';

@Injectable({
  providedIn: 'root'
})
export class HelperDishService {

  constructor(private macroService: MacroService, private helperFoodService: HelperFoodService) { }

  public calcCalories(dish: Dish): number {
    return dish.ingredients
      .map<number>(ingredient => this.calcIngredientCalories(ingredient))
      .reduce((caloriesSum, ingredientCalories) => caloriesSum + ingredientCalories);
  }

  /**
   * Calculate the number of grams of a macro nutrient in a dish as the sum of that macro in each ingredient
   * @param dish the dish
   * @param macro the macro
   */
  public calcMacro(dish: Dish, macro: MacroEnum): number {
    return dish.ingredients
      .map<number>(ingredient => this.calcIngredientIndividualMacro(ingredient, macro))
      .reduce((macroSum, ingredientMacro) => macroSum + ingredientMacro);
  }

  /**
   * Caculate the total calories in an ingredient as the sum of it's macro nutrient caloric values
   * @param ingredient the ingredient
   */
  private calcIngredientCalories(ingredient: Ingredient): number {
    return this.macroService.getMacroEnumList()
      .map<number>(macro => {
        return this.macroService.macroToCalories(this.calcIngredientIndividualMacro(ingredient, macro), macro);
      })
      .reduce((caloriesSum, macroCalories) => caloriesSum + macroCalories);
  }

  /**
   * Calculate the number of grams of a macro nutrient in an ingredient
   * @param ingredient the ingredient
   * @param macro the macro
   */
  private calcIngredientIndividualMacro(ingredient: Ingredient, macro: MacroEnum) {

    const macroServingSize: number = this.helperFoodService.getMacro(ingredient.food, macro);
    const ingredientAmount = ingredient.measurement.amount;
    const ingredientRatio = ingredient.measurement.unit.unitTypeRatio;
    const compatibleServingSize = ingredient.food.measurements.find(foodMmt =>
      foodMmt.unit.unitType === ingredient.measurement.unit.unitType
    );

    return macroServingSize * (
      (ingredientAmount * ingredientRatio)
      /
      (compatibleServingSize.amount * compatibleServingSize.unit.unitTypeRatio)
    );
  }
}
