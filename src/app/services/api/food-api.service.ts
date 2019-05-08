import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SortDirectionEnum } from '../../enums/sort-direction.enum';
import { Food } from '../../models/api/food.model';
import { SortableField } from '../../models/sortable-field';

@Injectable({
  providedIn: 'root'
})
export class FoodApiService {
  private baseUrl = `${environment.apiBaseUrl}/food`;

  public foodSortableFields: SortableField[] = [
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

  public create(food: Food): Observable<Food> {
    const options = {};
    return this.http.post<Food>(this.baseUrl, food, options);
  }

  public get(id: number): Observable<Food> {
    const options = {};
    return this.http.get<Food>(`${this.baseUrl}/${id}`, options);
  }

  public update(food: Food): Observable<Food> {
    const options = {};
    return this.http.put<Food>(this.baseUrl, food, options);
  }

  public delete(id: number): Observable<HttpResponse<any>> {
    const options = {};
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl}/${id}`, options);
  }

  public list(searchTerm: string, sortField: string, sortDirection: SortDirectionEnum): Observable<Food[]> {
    const options = {
      params: new HttpParams()
        .set('searchTerm', searchTerm)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection)
    };
    return this.http.get<Food[]>(this.baseUrl, options);
  }
}
