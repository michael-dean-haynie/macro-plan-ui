import { Measurement } from './measurement.model';

export interface Food {
  id?: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  name: string;
  brand?: string;
  styleOrFlavor?: string;
  measurements: Measurement[];
  isTemplate: boolean;
}
