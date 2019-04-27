import { Injectable } from '@angular/core';
import { Food } from '../models/api/food.model';
import { MacroEnum } from './../enums/macro.enum';

@Injectable({
  providedIn: 'root'
})
export class HelperFoodService {

  constructor() { }

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

  public getMacro(food: Food, macro: MacroEnum): number {
    switch (macro) {
      case MacroEnum.FAT: return food.fat;
      case MacroEnum.CARBS: return food.carbs;
      case MacroEnum.PROTEIN: return food.protein;
    }
  }
}
