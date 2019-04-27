import { Food } from './food.model';
import { Measurement } from './measurement.model';

export interface Ingredient {
  id?: number;
  food: Food;
  measurement: Measurement;
  isTemplate: boolean;
}