import { Injectable } from '@angular/core';
import { Food } from '../models/api/food.model';
import { MacroEnum } from './../enums/macro.enum';

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor() { }

  public macroToCalories(grams: number, macro: MacroEnum) {
    switch (macro) {
      case MacroEnum.FAT: return grams * 9;
      case MacroEnum.CARBS: return grams * 4;
      case MacroEnum.PROTEIN: return grams * 4;
    }
  }

  public getMacroEnumList(): MacroEnum[] {
    // kinda ridiculous right?
    const keys = Object.keys(MacroEnum);
    return keys.filter(k => isNaN(Number(k))).map(k => k as unknown as MacroEnum);
  }

  public getMacroPercentage(macro: string, food: Food) {
    if (!['fat', 'carbs', 'protein'].includes(macro)) {
      throw Error(`Could not find percentage of unknown macro "${macro}"`);
    }
    const fatCals = this.macroToCalories(food.fat, MacroEnum.FAT);
    const carbCals = this.macroToCalories(food.fat, MacroEnum.CARBS);
    const proteinCals = this.macroToCalories(food.fat, MacroEnum.PROTEIN);
    const totalCals = fatCals + carbCals + proteinCals;

    // TODO: maybe I should let a pipe format this?
    // TODO: switch stmt or something better
    return Math.floor(100 * (macro === 'fat' ? fatCals : macro === 'carbs' ? carbCals : proteinCals) / totalCals);
  }
}
