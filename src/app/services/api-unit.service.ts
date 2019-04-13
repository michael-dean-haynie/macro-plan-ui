import { Unit } from '../models/api/unit.model';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUnitService {
  private baseUrl = `${environment.apiBaseUrl}/unit`;

  constructor(private http: HttpClient) { }

  public getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl, {});
  }
}
