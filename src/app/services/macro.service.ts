import { Injectable } from '@angular/core';
import { MacroEnum } from './../enums/macro.enum';

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor() { }

  /**
   * Converts a macro from grams to calories
   * @param grams the number of grams of macro nutrient
   * @param macro the macro nutrient
   */
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
}
