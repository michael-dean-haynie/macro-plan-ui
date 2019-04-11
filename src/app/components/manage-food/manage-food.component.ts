import { Component, OnInit } from '@angular/core';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Food } from 'src/app/models/food.model';
import { ApiFoodService } from './../../services/api-food.service';

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.scss']
})
export class ManageFoodComponent implements OnInit {
  foods: Food[];
  myType = 'PieChart';
  myData = [
    ['carbs', 1],
    ['fat', 2],
    ['protein', 3]
  ];
  myOptions = {
    legend: 'none',
    pieHole: 0.25,
    width: 100,
    height: 100,
    chartArea: { left: '12%', top: '12%', width: '76%', height: '76%' },
    tooltip: { trigger: 'selection' }
  };

  constructor(private apiFoodService: ApiFoodService) { }

  ngOnInit() {
    this.apiFoodService.getFoods('', 'name', SortDirectionEnum.ASC)
      .subscribe(foods => this.foods = foods);
  }

}
