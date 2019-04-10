import { ApiFoodService } from './../../services/api-food.service';
import { Component, OnInit } from '@angular/core';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.scss']
})
export class ManageFoodComponent implements OnInit {

  constructor(private apiFoodService: ApiFoodService) { }

  ngOnInit() {
    this.apiFoodService.getFoods('', 'name', SortDirectionEnum.ASC).subscribe(foods => {
      foods.forEach(food => {
        console.log(food);
      });
    });
  }

}
