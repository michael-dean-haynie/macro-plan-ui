import { Injectable } from '@angular/core';
import { Unit } from 'src/app/models/api/unit.model';
import { UnitTypeEnum } from '../../enums/unit-type.enum';
import { UnitEnum } from '../../enums/unit.enum';

@Injectable({
  providedIn: 'root'
})
export class UnitHelperService {

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
