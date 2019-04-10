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

  constructor(private apiFoodService: ApiFoodService) { }

  ngOnInit() {
    this.apiFoodService.getFoods('', 'name', SortDirectionEnum.ASC)
      .subscribe(foods => this.foods = foods);
  }

}
