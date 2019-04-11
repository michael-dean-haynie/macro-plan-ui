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
    ['Fat', 1],
    ['Carbs', 2],
    ['Protein', 3],
  ];
  myOptions = {
    // legend: {
    //   position: 'right', alignment: 'center', textStyle: {
    //     fontSize: 12
    //   }
    // },
    legend: 'none',
    pieSliceText: 'none',
    width: 100,
    height: 100,
    chartArea: { left: '0', top: '0', height: '100%', width: '100%' },
    // tooltip: { trigger: 'selection' }
    tooltip: { trigger: 'none' },
    enableInteractivity: false
  };

  constructor(private apiFoodService: ApiFoodService) { }

  ngOnInit() {
    this.apiFoodService.getFoods('', 'name', SortDirectionEnum.ASC)
      .subscribe(foods => this.foods = foods);
  }

}
