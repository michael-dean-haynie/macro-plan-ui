import { Measurement } from './api/measurement.model';

export interface BreakdownItem {
  name: string;
  measurement: Measurement[];
  calories: number;
  caloriesPercentage: number;
  fat: number;
  fatCalories: number;
  fatPercentage: number;
  carbs: number;
  carbsCalories: number;
  carbsPercentage: number;
  protein: number;
  proteinCalories: number;
  proteinPercentage: number;
}