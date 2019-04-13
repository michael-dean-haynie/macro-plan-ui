import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'macro-plan-ui';

  @ViewChild('heading')
  heading: ElementRef;

  getHeightOfHeading() {
    return this.heading.nativeElement.offsetHeight;
  }
}
