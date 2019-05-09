import { Component, OnInit } from '@angular/core';
import { Plan } from 'src/app/models/api/plan.model';
import { PlanApiService } from '../../services/api/plan-api.service';
import { HeadingService } from './../../services/heading.service';

@Component({
  selector: 'app-manage-plans',
  templateUrl: './manage-plans.component.html',
  styleUrls: ['./manage-plans.component.scss']
})
export class ManagePlansComponent implements OnInit {
  // api results
  plans: Plan[];

  // loading (will be set to true while searches are being made)
  loading = true;

  constructor(
    private planApiService: PlanApiService,
    private headingService: HeadingService
  ) { }

  ngOnInit() {
    // Set heading text
    this.headingService.setHeadingText('Manage Plans');

    this.loadPlans();
  }

  private loadPlans(): void {
    this.plans = [];
    this.loading = true;

    this.planApiService.list().subscribe(plans => {
      this.plans = plans;
      this.loading = false;
    });
  }

}
