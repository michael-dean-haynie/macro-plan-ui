import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SortableField } from 'src/app/models/sortable-field';
import { environment } from 'src/environments/environment';
import { SortDirectionEnum } from '../enums/sort-direction.enum';
import { Dish } from './../models/api/dish.model';

@Injectable({
  providedIn: 'root'
})
export class ApiDishService {
  private baseUrl = `${environment.apiBaseUrl}/dish`;

  public dishSortableFields: SortableField[] = [
    { displayName: 'Calories', apiName: 'calories' },
    { displayName: 'Fat', apiName: 'fat' },
    { displayName: 'Fat %', apiName: 'fatPercentage' },
    { displayName: 'Carbs', apiName: 'carbs' },
    { displayName: 'Carbs %', apiName: 'carbsPercentage' },
    { displayName: 'Protein', apiName: 'protein' },
    { displayName: 'Protein %', apiName: 'proteinPercentage' },
    { displayName: 'Name', apiName: 'name' },

  ];

  constructor(private http: HttpClient) { }

  public create(dish: Dish): Observable<Dish> {
    const options = {};
    return this.http.post<Dish>(this.baseUrl, dish, options);
  }

  public get(id: number): Observable<Dish> {
    const options = {};
    return this.http.get<Dish>(`${this.baseUrl}/${id}`, options);
  }

  public update(dish: Dish): Observable<Dish> {
    const options = {};
    return this.http.put<Dish>(this.baseUrl, dish, options);
  }

  public delete(id: number): Observable<HttpResponse<any>> {
    const options = {};
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl}/${id}`, options);
  }

  public list(searchTerm: string, sortField: string, sortDirection: SortDirectionEnum): Observable<Dish[]> {
    const options = {
      params: new HttpParams()
        .set('searchTerm', searchTerm)
        .set('sortField', sortField)
        .set('sortDirection', sortDirection)
    };
    return this.http.get<Dish[]>(this.baseUrl, options);
  }
}
