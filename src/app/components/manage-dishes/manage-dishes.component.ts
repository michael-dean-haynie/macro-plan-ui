import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { Dish } from 'src/app/models/api/dish.model';
import { SortableField } from 'src/app/models/sortable-field';
import { MacroService } from 'src/app/services/macro.service';
import { DishApiService } from '../../services/api/dish-api.service';
import { SearchBarValues } from '../search-bar/search-bar.component';
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
    public helperDishService: HelperDishService,
    private router: Router,
    private dishApiService: DishApiService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    // Store sortable fields on dish (after sorting alpha asc)
    this.sortableFields = this.dishApiService.dishSortableFields
      .sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLocaleLowerCase()));

    this.loadDishes(this.initialSearchBarValues.searchTerm,
      this.initialSearchBarValues.activeSortField, this.initialSearchBarValues.activeSortDirection);
  }

  onSearchSubmitted(searchBarValues: SearchBarValues) {
    this.loadDishes(searchBarValues.searchTerm, searchBarValues.activeSortField, searchBarValues.activeSortDirection);
  }

  onNewButtonClicked(): void {
    this.router.navigate(['manage-dishes', 'create']);
  }

  private loadDishes(searchTerm: string, activeSortField: string, activeSortDirection: SortDirectionEnum): void {
    this.dishes = [];
    this.loading = true;

    this.dishApiService.list(searchTerm, activeSortField, activeSortDirection)
      .subscribe(
        dishes => {
          this.dishes = dishes;
          this.loading = false;
        },
        (error) => { this.snackBarService.showError(); });
  }
}
