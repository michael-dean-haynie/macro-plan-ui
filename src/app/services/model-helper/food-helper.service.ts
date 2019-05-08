import { Injectable } from '@angular/core';
import { MacroEnum } from '../../enums/macro.enum';
import { Food } from '../../models/api/food.model';
import { MacroService } from '../macro.service';

@Injectable({
  providedIn: 'root'
})
export class FoodHelperService {

  constructor(private macroService: MacroService) { }

  public getEmptyFood(): Food {
    return {
      id: null,
      calories: null,
      fat: null,
      carbs: null,
      protein: null,
      name: null,
      brand: null,
      styleOrFlavor: null,
      measurements: null,
      isTemplate: true
    };
  }

  /**
   * Retrieve the number of grams of macro nutrients in 1 serving of a food
   * @param food the food
   * @param macro the macro nutrient
   */
  public getMacro(food: Food, macro: MacroEnum): number {
    switch (macro) {
      case MacroEnum.FAT: return food.fat;
      case MacroEnum.CARBS: return food.carbs;
      case MacroEnum.PROTEIN: return food.protein;
    }
  }

  public getMacroPercentage(macro: MacroEnum, food: Food) {
    const targetMacroCals = this.macroService.macroToCalories(this.getMacro(food, macro), macro);

    const fatCals = this.macroService.macroToCalories(food.fat, MacroEnum.FAT);
    const carbCals = this.macroService.macroToCalories(food.carbs, MacroEnum.CARBS);
    const proteinCals = this.macroService.macroToCalories(food.protein, MacroEnum.PROTEIN);
    const totalCals = fatCals + carbCals + proteinCals;

    return 100 * targetMacroCals / totalCals;
  }
}
