import { Unit } from './unit.model';

export interface Measurement {
  id?: number;
  unit: Unit;
  value: number;
}