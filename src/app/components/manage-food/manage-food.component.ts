import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Food } from 'src/app/models/api/food.model';
import { SortableField } from '../../models/sortable-field';
import { FoodApiService } from '../../services/api/food-api.service';
import { SearchBarValues } from '../search-bar/search-bar.component';
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

  constructor(
    public macroService: MacroService,
    private router: Router,
    private foodApiService: FoodApiService,
    private helperFoodService: HelperFoodService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    // Store sortable fields on food (after sorting alpha asc)
    this.sortableFields = this.foodApiService.foodSortableFields
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

  private loadFoods(searchTerm: string, activeSortField: string, activeSortDirection: SortDirectionEnum): void {
    this.foods = [];
    this.loading = true;

    this.foodApiService.list(searchTerm, activeSortField, activeSortDirection)
      .subscribe(
        foods => {
          this.foods = foods;
          this.loading = false;
        },
        (error) => { this.snackBarService.showError(); });
  }

}
