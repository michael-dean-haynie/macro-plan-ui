import { Injectable } from '@angular/core';
import { Unit } from 'src/app/models/api/unit.model';
import { UnitEnum } from '../enums/unit.enum';
import { UnitTypeEnum } from './../enums/unit-type.enum';

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

  public getUnitModelByEnum(unitEnum: UnitEnum, units: Unit[]): Unit {
    return units.find(unit => unit.unit === unitEnum);
  }

  public getUnitTypeEnumList(): UnitTypeEnum[] {
    const keys = Object.keys(UnitTypeEnum);
    return keys.filter(k => isNaN(Number(k))).map(k => k as unknown as UnitTypeEnum);
  }
}
