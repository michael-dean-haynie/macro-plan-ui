import { Injectable } from '@angular/core';
import { Food } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class HelperFoodService {

  constructor() { }

  public fatToCalories(grams: number): number {
    return grams * 9;
  }

  public carbsToCalories(grams: number): number {
    return grams * 4;
  }

  public proteinToCalories(grams: number): number {
    return grams * 4;
  }

  public getMacroPercentage(macro: string, food: Food) {
    if (!['fat', 'carbs', 'protein'].includes(macro)) {
      throw Error(`Could not find percentage of unknown macro "${macro}"`);
    }
    const fatCals = this.fatToCalories(food.fat);
    const carbCals = this.carbsToCalories(food.carbs);
    const proteinCals = this.proteinToCalories(food.protein);
    const totalCals = fatCals + carbCals + proteinCals;

    // TODO: maybe I should let a pipe format this?
    // TODO: switch stmt or something better
    return Math.floor(100 * (macro === 'fat' ? fatCals : macro === 'carbs' ? carbCals : proteinCals) / totalCals);
  }
}
