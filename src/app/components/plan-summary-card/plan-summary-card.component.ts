import { Component, Input, OnInit } from '@angular/core';
import { MacroEnum } from 'src/app/enums/macro.enum';
import { Plan } from 'src/app/models/api/plan.model';
import { BreakdownItem } from 'src/app/models/breakdown-item.model';
import { PlanHelperService } from '../../services/model-helper/plan-helper.service';
import { BreakdownService } from './../../services/breakdown.service';

@Component({
  selector: 'app-plan-summary-card',
  templateUrl: './plan-summary-card.component.html',
  styleUrls: ['./plan-summary-card.component.scss']
})
export class PlanSummaryCardComponent implements OnInit {

  @Input() plan: Plan;

  // Marcos
  planCalories: number;
  planFat: number;
  planCarbs: number;
  planProtein: number;

  // table
  breakdownColumnsToDisplay = ['name', 'calories', 'fat', 'carbs', 'protein'];
  breakdownData: BreakdownItem[] = [];

  constructor(private planHelperService: PlanHelperService, private breakdownService: BreakdownService) { }

  ngOnInit() {
    // calculate macros
    this.planCalories = this.planHelperService.calcCalories(this.plan);
    this.planFat = this.planHelperService.calcIndividualMacro(this.plan, MacroEnum.FAT);
    this.planCarbs = this.planHelperService.calcIndividualMacro(this.plan, MacroEnum.CARBS);
    this.planProtein = this.planHelperService.calcIndividualMacro(this.plan, MacroEnum.PROTEIN);

    this.loadBreakdownData();
  }

  private loadBreakdownData(): void {
    this.plan.plates.forEach(plate => {
      this.breakdownData.push(this.breakdownService.convertPlateForPlan(plate, this.plan));
    });

    this.plan.ingredients.forEach(ingredient => {
      this.breakdownData.push(this.breakdownService.convertIngredientForPlan(ingredient, this.plan));
    });
  }

}
