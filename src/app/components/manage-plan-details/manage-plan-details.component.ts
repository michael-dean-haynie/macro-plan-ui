import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Plan } from 'src/app/models/api/plan.model';
import { PlanApiService } from './../../services/api/plan-api.service';
import { HeadingService } from './../../services/heading.service';

@Component({
  selector: 'app-manage-plan-details',
  templateUrl: './manage-plan-details.component.html',
  styleUrls: ['./manage-plan-details.component.scss']
})
export class ManagePlanDetailsComponent implements OnInit {
  planId: number;
  idLoaded$ = new ReplaySubject();
  createMode = false;

  // api results
  plan: Plan;
  planLoaded$ = new ReplaySubject();

  // form controls
  planForm: FormGroup;
  planFormBuilt$ = new ReplaySubject();

  // loading
  loading = true;

  constructor(
    private headingService: HeadingService,
    private route: ActivatedRoute,
    private planApiService: PlanApiService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Plans');

    // Set loading = false once nessesary data is loaded
    forkJoin([
      this.idLoaded$.pipe(first()), // <-- first() completes once a single value has been emitted
      this.planLoaded$.pipe(first())
    ]).subscribe(() => {
      this.loading = false;
    });

    // load plan id
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.get('id') === 'create') {
        this.createMode = true;
      } else {
        this.planId = +paramMap.get('id'); // <-- convert to number
      }

      this.idLoaded$.next();
    });

    // load plan
    this.idLoaded$.subscribe(() => {
      this.loadPlan();
    });

  }

  /**
   * ----------------------------------------
   * User Input
   * ----------------------------------------
   */
  onClickDeletePlan(): void {
    // TODO
  }

  onSubmit(): void {
    // TODO
  }

  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadPlan(): void {
    this.planApiService.get(this.planId).subscribe(plan => {
      // TODO: Remove
      console.log(plan);
      this.planLoaded$.next();

      // pu@ if create-mode, subscribe to defaultFormBuilt$ and ...
    });
  }

}
