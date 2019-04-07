import { UnitEnum } from './../enums/unit.enum';
import { UnitTypeEnum } from './../enums/unit-type.enum';
import { UnitSystemEnum } from './../enums/unit-system.enum';

export interface Unit {
  id: number;
  unitSystem: UnitSystemEnum;
  unitType: UnitTypeEnum;
  unit: UnitEnum;
  properName: string;
  abbreviation: string;
  unitTypeRatio: number;
}