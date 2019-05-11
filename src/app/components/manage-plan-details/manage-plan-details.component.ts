import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Plan } from 'src/app/models/api/plan.model';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { PlanApiService } from './../../services/api/plan-api.service';
import { HeadingService } from './../../services/heading.service';
import { PlanHelperService } from './../../services/model-helper/plan-helper.service';

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
    private router: Router,
    private planApiService: PlanApiService,
    private planHelperService: PlanHelperService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private location: Location
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Plans');

    // Set loading = false once nessesary data is loaded
    forkJoin([
      // this.idLoaded$.pipe(first()), // <-- first() completes once a single value has been emitted
      // this.planLoaded$.pipe(first())
      this.planFormBuilt$.pipe(first())
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

    // build form
    this.planLoaded$.subscribe(() => {
      this.populateFormDataWithApiModel();
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

  onClickCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      this.populateApiModelWithFormData();

      if (this.createMode) {
        this.planApiService.create(this.plan).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully created plan`);
            this.router.navigate(['manage-plans']);
          }, (error) => {
            this.snackBarService.showError(`Something went wrong. Could not create plan.`);
          });
      } else {
        this.planApiService.update(this.plan).subscribe(
          () => {
            this.snackBarService.showSuccess(`Successfully updated plan`);
            this.router.navigate(['manage-plans']);
          },
          (error) => {
            this.snackBarService.showError(`Something went wrong. Could not update plan.`);
          });
      }

    } else {
      // TODO: let user know
    }
  }

  /**
   * ----------------------------------------
   * Private
   * ----------------------------------------
   */

  private loadPlan(): void {
    if (this.createMode) {
      this.plan = this.planHelperService.getEmptyPlan();
      this.planLoaded$.next();
    } else {
      this.planApiService.get(this.planId).subscribe(plan => {
        this.plan = plan;
        this.planLoaded$.next();
      });
    }
  }

  private populateFormDataWithApiModel(): void {
    this.planForm = this.buildDefaultForm();

    this.planForm.patchValue({
      calories: this.plan.calories,
      fat: this.plan.fat,
      carbs: this.plan.carbs,
      protein: this.plan.protein
    });

    // empty default, then load existing ingredients

    // empty default, then load existing plates

    this.planFormBuilt$.next();
  }

  private populateApiModelWithFormData(): void {
    // shorten for readability
    const p = this.plan;
    const pf = this.planForm;

    p.calories = pf.get('calories').value;
    p.fat = pf.get('fat').value;
    p.carbs = pf.get('carbs').value;
    p.protein = pf.get('protein').value;

    // populate ingredients

    // populate plates
  }

  private buildDefaultForm(): FormGroup {
    return this.fb.group({
      calories: [null],
      fat: [null],
      carbs: [null],
      protein: [null],
      ingredients: this.fb.array([]),
      plates: this.fb.array([])
    });
  }

}
