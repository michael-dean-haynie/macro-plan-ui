import { FoodSortableField } from '../../models/food-sortable-field';
import { HelperFoodService } from './../../services/helper-food.service';
import { Component, OnInit } from '@angular/core';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Food } from 'src/app/models/api/food.model';
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

  // Sorting
  foodSortableFields: FoodSortableField[];
  activeSortField: string;
  SortDirectionEnum = SortDirectionEnum; // make it available to tempalte for comparisons
  activeSortDirection: SortDirectionEnum = SortDirectionEnum.ASC;

  // Searching
  searchTerm = '';
  searchResultsMessage = '';


  constructor(private apiFoodService: ApiFoodService, private helperFoodService: HelperFoodService) { }

  ngOnInit() {
    // Store sortable fields on food (after sorting alpha asc). Set default sort field (name)
    this.foodSortableFields = this.apiFoodService.foodSortableFields
      .sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLocaleLowerCase()));
    this.activeSortField = 'name';

    this.loadFoods();
  }

  loadFoods(): void {
    this.apiFoodService.getFoods(this.searchTerm, this.activeSortField, this.activeSortDirection)
      .subscribe(foods => {
        this.foods = foods;

        // TODO: Fix this. For some reason when I try to bind directly to the google-chart [data] attribute
        // using a method the browser gets stuck in some sort of infinate loop and chrome crashes.
        // If I set it using a static value it's fine - hence the chartDataMap
        this.foods.forEach(food => {
          this.chartDataMap[food.id] = this.prepareChartData(food);
        });

        this.updateSearchResultsMessage();
      });
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    this.loadFoods();
  }

  onSortFieldSelected(sortField: string): void {
    this.activeSortField = sortField;
    this.loadFoods();
  }

  toggleSortDirection(): void {
    this.activeSortDirection =
      (this.activeSortDirection === SortDirectionEnum.ASC ? SortDirectionEnum.DESC : SortDirectionEnum.ASC);

    this.loadFoods();
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

  private updateSearchResultsMessage(): void {
    this.searchResultsMessage = `${this.foods.length} results found (${!this.searchTerm ? 'empty search' : '"' + this.searchTerm + '"'})`;
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
