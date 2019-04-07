import { ApiUnitService } from './services/api-unit.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'macro-plan-ui';

  constructor(private apiUnitService: ApiUnitService) { }

  ngOnInit() {
    this.apiUnitService.getUnits().subscribe(units => {
      units.forEach(unit => {
        console.log(unit);
      });
    });
  }
}
