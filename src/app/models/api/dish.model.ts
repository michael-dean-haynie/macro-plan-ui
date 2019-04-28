import { Ingredient } from './ingredient.model';
import { Measurement } from './measurement.model';

export interface Dish {
  id?: number;
  name: string;
  measurements: Measurement[];
  ingredients: Ingredient[];
  isTemplate: boolean;
}
