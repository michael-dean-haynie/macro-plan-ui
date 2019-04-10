import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Food } from '../models/food.model';
import { SortDirectionEnum } from './../enums/sort-direction.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodService {
  private baseUrl = `${environment.apiBaseUrl}/food`;

  constructor(private http: HttpClient) { }

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
