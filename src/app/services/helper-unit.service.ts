import { Unit } from 'src/app/models/api/unit.model';
import { UnitTypeEnum } from './../enums/unit-type.enum';
import { Injectable } from '@angular/core';
import { UnitEnum } from '../enums/unit.enum';

@Injectable({
  providedIn: 'root'
})
export class HelperUnitService {

  constructor() { }

  public getUnitsOfType(unitType: UnitTypeEnum, units: Unit[]): UnitEnum[] {
    return units
      .filter(unit => unit.unitType === unitType)
      .map(unit => unit.unit);
  }
}
