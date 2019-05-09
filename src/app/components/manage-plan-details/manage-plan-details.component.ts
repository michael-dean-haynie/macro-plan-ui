import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject, timer } from 'rxjs';
import { Plan } from 'src/app/models/api/plan.model';
import { HeadingService } from './../../services/heading.service';

@Component({
  selector: 'app-manage-plan-details',
  templateUrl: './manage-plan-details.component.html',
  styleUrls: ['./manage-plan-details.component.scss']
})
export class ManagePlanDetailsComponent implements OnInit {

  // api results
  plan: Plan;
  planLoaded$ = new Subject();

  // loading
  loading = true;

  constructor(
    private headingService: HeadingService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Plans');

    // Set loading to false when nessesary data is loaded
    forkJoin([
      this.planLoaded$
    ]).subscribe(() => {
      this.loading = false;
    });

    timer(1000).subscribe(() => {
      this.emitAndComplete(this.planLoaded$);
    });
  }

  // Convenience method for completing an observable, indicating the process is complete
  private emitAndComplete(subject: Subject<any>) {
    subject.next();
    subject.complete();
  }

}
