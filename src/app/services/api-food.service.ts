import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Food } from '../models/api/food.model';
import { FoodSortableField } from '../models/food-sortable-field';
import { SortDirectionEnum } from './../enums/sort-direction.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodService {
  private baseUrl = `${environment.apiBaseUrl}/food`;

  foodSortableFields: FoodSortableField[] = [
    { displayName: 'Calories', apiName: 'calories' },
    { displayName: 'Fat', apiName: 'fat' },
    { displayName: 'Fat %', apiName: 'fatPercentage' },
    { displayName: 'Carbs', apiName: 'carbs' },
    { displayName: 'Carbs %', apiName: 'carbsPercentage' },
    { displayName: 'Protein', apiName: 'protein' },
    { displayName: 'Protein %', apiName: 'proteinPercentage' },
    { displayName: 'Name', apiName: 'name' },
    { displayName: 'Brand', apiName: 'brand' },
    { displayName: 'Style/Flavor', apiName: 'styleOrFlavor' },

  ];

  constructor(private http: HttpClient) { }

  public createFood(food: Food): Observable<Food> {
    const options = {};
    return this.http.post<Food>(this.baseUrl, food, options);
  }

  public getFood(id: number): Observable<Food> {
    const options = {};
    return this.http.get<Food>(`${this.baseUrl}/${id}`, options);
  }

  public updateFood(food: Food): Observable<Food> {
    const options = {};
    return this.http.put<Food>(this.baseUrl, food, options);
  }

  public deleteFood(id: number): Observable<HttpResponse<any>> {
    const options = {};
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl}/${id}`, options);
  }

  public getFoods(searchTerm: string, sortField: string, sortDirection: SortDirectionEnum): Observable<Food[]> {
    const options = {
      params: new HttpParams()
        .set('searchTerm', searchTerm)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection)
    };
    return this.http.get<Food[]>(this.baseUrl, options);
  }
}
