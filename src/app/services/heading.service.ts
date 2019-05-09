import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeadingService {
  headingText$ = new Subject<string>();

  constructor() {
    this.headingText$.next('');
  }

  public setHeadingText(text: string): void {
    this.headingText$.next(text);
  }
}
