import { FoodSortableField } from '../models/food-sortable-field';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Food } from '../models/api/food.model';
import { SortDirectionEnum } from './../enums/sort-direction.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodService {
  private baseUrl = `${environment.apiBaseUrl}/food`;

  foodSortableFields: FoodSortableField[] = [
    { displayName: 'Calories', apiName: 'calories' },
    { displayName: 'Fat', apiName: 'fat' },
    { displayName: 'Carbs', apiName: 'carbs' },
    { displayName: 'Protein', apiName: 'protein' },
    { displayName: 'Name', apiName: 'name' },
    { displayName: 'Brand', apiName: 'brand' },
    { displayName: 'Style/Flavor', apiName: 'styleOrFlavor' },
    // TODO: Add in derrived fields like percentages and maybe other stuff
  ];

  constructor(private http: HttpClient) { }

  public getFood(id: number): Observable<Food> {
    const options = {};
    return this.http.get<Food>(`${this.baseUrl}/${id}`, options);
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
