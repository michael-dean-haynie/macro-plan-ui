import { Pipe, PipeTransform } from '@angular/core';
import { Measurement } from './../models/api/measurement.model';

@Pipe({
  name: 'measurements'
})
export class MeasurementsPipe implements PipeTransform {

  transform(mmts: Measurement[], args?: any): any {
    return mmts.map(mmt => {
      return (Math.round(mmt.amount * 100) / 100) +
        ' ' +
        mmt.unit.abbreviation;
    }).join(', ');
  }

}
