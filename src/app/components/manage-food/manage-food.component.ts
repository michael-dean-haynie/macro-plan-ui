import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Food } from 'src/app/models/api/food.model';
import { SortableField } from '../../models/sortable-field';
import { SearchBarValues } from '../search-bar/search-bar.component';
import { MacroEnum } from './../../enums/macro.enum';
import { ApiFoodService } from './../../services/api-food.service';
import { HelperFoodService } from './../../services/helper-food.service';
import { MacroService } from './../../services/macro.service';
import { SnackBarService } from './../../services/snack-bar.service';

@Component({
  selector: 'app-manage-food',
  templateUrl: './manage-food.component.html',
  styleUrls: ['./manage-food.component.scss']
})
export class ManageFoodComponent implements OnInit {
  // api results
  foods: Food[];

  // chart data
  chartOptions = this.buildChartOptions();
  chartDataMap = {};
  chartReadyMap = {};

  // searching
  initialSearchBarValues: SearchBarValues = {
    searchTerm: '',
    activeSortField: 'name',
    activeSortDirection: SortDirectionEnum.ASC
  };

  // sorting
  sortableFields: SortableField[];

  // loading (will be set to true while searches are being made)
  loading = true;

  // template accessible enums
  MacroEnum = MacroEnum;


  constructor(
    public macroService: MacroService,
    private router: Router,
    private apiFoodService: ApiFoodService,
    private helperFoodService: HelperFoodService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    // Store sortable fields on food (after sorting alpha asc)
    this.sortableFields = this.apiFoodService.foodSortableFields
      .sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLocaleLowerCase()));

    this.loadFoods(this.initialSearchBarValues.searchTerm,
      this.initialSearchBarValues.activeSortField, this.initialSearchBarValues.activeSortDirection);
  }

  onSearchSubmitted(searchBarValues: SearchBarValues) {
    this.loadFoods(searchBarValues.searchTerm, searchBarValues.activeSortField, searchBarValues.activeSortDirection);
  }

  onNewButtonClicked(): void {
    this.router.navigate(['manage-food', 'create']);
  }

  onFoodSelected(id: number): void {
    this.router.navigate(['manage-food', id]);
  }

  private loadFoods(searchTerm: string, activeSortField: string, activeSortDirection: SortDirectionEnum): void {
    this.foods = [];
    this.loading = true;
    this.chartDataMap = {};
    this.chartReadyMap = {};

    this.apiFoodService.list(searchTerm, activeSortField, activeSortDirection)
      .subscribe(
        foods => {
          this.loading = false;
          this.foods = foods;

          // TODO: Fix this. For some reason when I try to bind directly to the google-chart [data] attribute
          // using a method the browser gets stuck in some sort of infinate loop and chrome crashes.
          // If I set it using a static value it's fine - hence the chartDataMap
          this.foods.forEach(food => {
            this.chartDataMap[food.id] = this.prepareChartData(food);
          });
        },
        (error) => { this.snackBarService.showError(); });
  }

  private prepareChartData(food: Food): Array<Array<string | number | {}>> {
    return [
      ['Fat', this.macroService.macroToCalories(food.fat, MacroEnum.FAT)],
      ['Carbs', this.macroService.macroToCalories(food.carbs, MacroEnum.CARBS)],
      ['Protein', this.macroService.macroToCalories(food.protein, MacroEnum.FAT)],
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
