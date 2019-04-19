import { Measurement } from './../models/api/measurement.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'measurements'
})
export class MeasurementsPipe implements PipeTransform {

  transform(mmts: Measurement[], args?: any): any {
    return mmts.map(mmt => {
      return mmt.value + ' ' + mmt.unit.abbreviation;
    }).join(', ');
  }

}
