import { Component, OnInit } from '@angular/core';
import { MacroEnum } from 'src/app/enums/macro.enum';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Dish } from 'src/app/models/api/dish.model';
import { SortableField } from 'src/app/models/sortable-field';
import { MacroService } from 'src/app/services/macro.service';
import { SearchBarValues } from '../search-bar/search-bar.component';
import { ApiDishService } from './../../services/api-dish.service';
import { HelperDishService } from './../../services/helper-dish.service';
import { SnackBarService } from './../../services/snack-bar.service';

@Component({
  selector: 'app-manage-dishes',
  templateUrl: './manage-dishes.component.html',
  styleUrls: ['./manage-dishes.component.scss']
})
export class ManageDishesComponent implements OnInit {
  // api results
  dishes: Dish[];

  // chart data
  chartOptions = this.buildChartOptions();
  chartDataMap = {};
  chartReadyMap = {};

  // searching
  initialSearchBarValues: SearchBarValues = {
    searchTerm: '',
    activeSortField: 'name',
    activeSortDirection: SortDirectionEnum.ASC
  }

  // sorting
  sortableFields: SortableField[];

  // loading (will be set to true while searches are being made)
  loading = true;

  constructor(
    public macroService: MacroService,
    private apiDishService: ApiDishService,
    private helperDishService: HelperDishService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    // Store sortable fields on dish (after sorting alpha asc)
    this.sortableFields = this.apiDishService.dishSortableFields
      .sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLocaleLowerCase()));

    this.loadDishes(this.initialSearchBarValues.searchTerm,
      this.initialSearchBarValues.activeSortField, this.initialSearchBarValues.activeSortDirection)
  }

  private loadDishes(searchTerm: string, activeSortField: string, activeSortDirection: SortDirectionEnum): void {
    this.dishes = [];
    this.loading = true;
    this.chartDataMap = {};
    this.chartReadyMap = {};

    this.apiDishService.list(searchTerm, activeSortField, activeSortDirection)
      .subscribe(
        dishes => {
          this.loading = false;
          this.dishes = dishes;

          // TODO: Fix this. For some reason when I try to bind directly to the google-chart [data] attribute
          // using a method the browser gets stuck in some sort of infinate loop and chrome crashes.
          // If I set it using a static value it's fine - hence the chartDataMap
          this.dishes.forEach(dish => {
            this.chartDataMap[dish.id] = this.prepareChartData(dish);
          });

          // TODO: remove
          console.log(this.dishes);
          console.log(this.chartDataMap);
        },
        (error) => { this.snackBarService.showError(); });
  }

  private prepareChartData(dish: Dish): Array<Array<string | number | {}>> {
    return [
      ['Fat', this.macroService.macroToCalories(this.helperDishService.calcMacro(dish, MacroEnum.FAT), MacroEnum.FAT)],
      ['Carbs', this.macroService.macroToCalories(this.helperDishService.calcMacro(dish, MacroEnum.CARBS), MacroEnum.CARBS)],
      ['Protein', this.macroService.macroToCalories(this.helperDishService.calcMacro(dish, MacroEnum.PROTEIN), MacroEnum.PROTEIN)],
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
      // pieSliceText: 'label',
      // pieSliceTextStyle: {
      //   fontSize: 10
      // },
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
