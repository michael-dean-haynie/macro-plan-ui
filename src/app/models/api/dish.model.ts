import { Ingredient } from './ingredient.model';
import { Measurement } from './measurement.model';

export interface Dish {
  id?: number;
  calories: number;
  measurements: Measurement[];
  ingredients: Ingredient[];
  isTemplate: boolean;
}
