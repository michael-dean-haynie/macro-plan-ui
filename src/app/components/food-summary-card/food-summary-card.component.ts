import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MacroEnum } from 'src/app/enums/macro.enum';
import { MacroService } from 'src/app/services/macro.service';
import { Food } from './../../models/api/food.model';
import { HelperFoodService } from './../../services/helper-food.service';

@Component({
  selector: 'app-food-summary-card',
  templateUrl: './food-summary-card.component.html',
  styleUrls: ['./food-summary-card.component.scss']
})
export class FoodSummaryCardComponent implements OnInit {

  // api data
  @Input() food: Food;

  // calculated data
  fatCalories: number;
  carbsCalories: number;
  proteinCalories: number;

  fatPercentage: number;
  carbsPercentage: number;
  proteinPercentage: number;

  // chart
  chartReady = false;
  chartOptions = this.buildChartOptions();
  chartData: Array<Array<string | number | {}>>;

  // summary data format contexts
  gramSDFC: number[];
  calSDFC: number[];

  constructor(private router: Router, private macroService: MacroService, private helperFoodService: HelperFoodService) { }

  ngOnInit() {
    // run calculations
    this.fatCalories = this.macroService.macroToCalories(this.food.fat, MacroEnum.FAT);
    this.carbsCalories = this.macroService.macroToCalories(this.food.carbs, MacroEnum.CARBS);
    this.proteinCalories = this.macroService.macroToCalories(this.food.protein, MacroEnum.PROTEIN);

    this.fatPercentage = this.helperFoodService.getMacroPercentage(MacroEnum.FAT, this.food);
    this.carbsPercentage = this.helperFoodService.getMacroPercentage(MacroEnum.CARBS, this.food);
    this.proteinPercentage = this.helperFoodService.getMacroPercentage(MacroEnum.PROTEIN, this.food);

    this.chartData = [
      ['Fat', this.fatCalories],
      ['Carbs', this.carbsCalories],
      ['Protein', this.proteinCalories],
    ];

    this.applySummaryDataFormatContexts();
  }

  onFoodSelected(id: number): void {
    this.router.navigate(['manage-food', id]);
  }

  private buildChartOptions() {
    return {
      // legend: {
      //   position: 'right', alignment: 'center', textStyle: {
      //     fontSize: 12
      //   }
      // },
      legend: 'none',
      pieSliceText: 'none',
      // pieSliceText: 'label',
      // pieSliceTextStyle: {
      //   fontSize: 10
      // },
      width: 100,
      height: 100,
      chartArea: { left: '0', top: '0', height: '100%', width: '100%' },
      // tooltip: { trigger: 'selection' }
      tooltip: { trigger: 'none' },
      enableInteractivity: false,
      // these colors are also in sht style-variables.scss file
      // TODO: maybe store these away in a service or something so they aren't hard-coded in every component
      slices: {
        0: { color: 'rgb(255, 153, 0)' },
        1: { color: 'rgb(16, 150, 24)' },
        2: { color: 'rgb(220, 57, 18)' }
      }
    };
  }

  private applySummaryDataFormatContexts(): void {
    this.gramSDFC = [this.food.fat, this.food.carbs, this.food.protein];
    this.calSDFC = [this.fatCalories, this.carbsCalories, this.proteinCalories];
  }

}
