import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const response = event as HttpResponse<any>;
            // can do things here if I want
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            const response = error as HttpErrorResponse;

            switch (response.status) {
              case 400: { // Bad Request
                break;
              }
              case 401: { // Unauthorized (Unauthenticated)
                break;
              }
              case 402: { // Unauthorized (Forbidden)
                break;
              }
              case 404: { // Not Found
                break;
              }
              default: { // Something went wrong!
                break;
              }
            }
          }
        })
    );
  }
}
