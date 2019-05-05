import { Dish } from './dish.model';
import { Measurement } from './measurement.model';

export interface Plate {
  id?: number;
  dish: Dish;
  measurement: Measurement;
  isTemplate;
}