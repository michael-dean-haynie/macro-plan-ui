import { Ingredient } from './ingredient.model';
import { Plate } from './plate.model';

export interface Plan {
  id?: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  ingredients: Ingredient[];
  plates: Plate[];
  isTemplate: boolean;
}