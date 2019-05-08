import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Unit } from '../../models/api/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitApiService {
  private baseUrl = `${environment.apiBaseUrl}/unit`;

  constructor(private http: HttpClient) { }

  public getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl, {});
  }
}
