import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plan } from './../models/api/plan.model';

@Injectable({
  providedIn: 'root'
})
export class ApiPlanService {
  private baseUrl = `${environment.apiBaseUrl}/plan`;

  constructor(private http: HttpClient) { }

  public create(plan: Plan): Observable<Plan> {
    const options = {};
    return this.http.post<Plan>(this.baseUrl, plan, options);
  }

  public get(id: number): Observable<Plan> {
    const options = {};
    return this.http.get<Plan>(`${this.baseUrl}/${id}`, options);
  }

  public update(plan: Plan): Observable<Plan> {
    const options = {};
    return this.http.put<Plan>(this.baseUrl, plan, options);
  }

  public delete(id: number): Observable<HttpResponse<any>> {
    const options = {};
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl}/${id}`, options);
  }

  public list(): Observable<Plan[]> {
    const options = {};
    return this.http.get<Plan[]>(this.baseUrl, options);
  }
}
