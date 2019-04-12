import { HelperFoodService } from './../../services/helper-food.service';
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
  chartDataMap = {};
  chartOptions = this.buildChartOptions();

  constructor(private apiFoodService: ApiFoodService, private helperFoodService: HelperFoodService) { }

  ngOnInit() {
    this.apiFoodService.getFoods('', 'name', SortDirectionEnum.ASC)
      .subscribe(foods => {
        this.foods = foods;

        // TODO: Fix this. For some reason when I try to bind directly to the google-chart [data] attribute
        // using a method the browser gets stuck in some sort of infinate loop and chrome crashes.
        // If I set it using a static value it's fine - hence the chartDataMap
        this.foods.forEach(food => {
          this.chartDataMap[food.id] = this.prepareChartData(food);
        });

      });
  }

  getCalsFromFat(grams: number): number {
    return this.helperFoodService.fatToCalories(grams);
  }
  getCalsFromCarbs(grams: number): number {
    return this.helperFoodService.carbsToCalories(grams);
  }
  getCalsFromProtein(grams: number): number {
    return this.helperFoodService.proteinToCalories(grams);
  }
  getMacroPercentage(macro: string, food: Food) {
    return this.helperFoodService.getMacroPercentage(macro, food);
  }

  // TODO: add type safety? Array<Array<string | number | {}>>,
  private prepareChartData(food: Food) {
    return [
      ['Fat', this.helperFoodService.fatToCalories(food.fat)],
      ['Carbs', this.helperFoodService.carbsToCalories(food.carbs)],
      ['Protein', this.helperFoodService.proteinToCalories(food.protein)],
    ];
  }

  private buildChartOptions() {
    return {
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
      enableInteractivity: false,
      // these colors are also in sht style-variables.scss file
      // TODO: maybe store these away in a service or something so they aren't hard-coded in every component
      slices: {
        0: { color: 'rgb(255, 153, 0)' },
        1: { color: 'rgb(16, 150, 24)' },
        2: { color: 'rgb(220, 57, 18)' }
      }
    };
  }

}
