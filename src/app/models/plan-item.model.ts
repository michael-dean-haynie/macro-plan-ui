import { Dish } from './api/dish.model';
import { Food } from './api/food.model';


export interface PlanItem {
  id: string;
  item: Food | Dish;
}
