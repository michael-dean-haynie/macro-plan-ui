import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MacroEnum } from 'src/app/enums/macro.enum';
import { Dish } from 'src/app/models/api/dish.model';
import { BreakdownItem } from 'src/app/models/breakdown-item.model';
import { MacroService } from 'src/app/services/macro.service';
import { BreakdownService } from './../../services/breakdown.service';
import { HelperDishService } from './../../services/helper-dish.service';

@Component({
    selector: 'app-dish-summary-card',
    templateUrl: './dish-summary-card.component.html',
    styleUrls: ['./dish-summary-card.component.scss']
})
export class DishSummaryCardComponent implements OnInit {

    // api data
    @Input() dish: Dish;

    // calculated data
    calories: number;
    fat: number;
    carbs: number;
    protein: number;

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

    // table
    breakdownColumnsToDisplay = ['name', 'calories', 'fat', 'carbs', 'protein'];
    breakdownData: BreakdownItem[] = [];

    constructor(
        private router: Router,
        private helperDishService: HelperDishService,
        private macroService: MacroService,
        private breakdownService: BreakdownService) { }

    ngOnInit() {
        // run calculations
        this.calories = this.helperDishService.calcCalories(this.dish);
        this.fat = this.helperDishService.calcMacro(this.dish, MacroEnum.FAT);
        this.carbs = this.helperDishService.calcMacro(this.dish, MacroEnum.CARBS);
        this.protein = this.helperDishService.calcMacro(this.dish, MacroEnum.PROTEIN);

        this.fatCalories = this.macroService.macroToCalories(this.fat, MacroEnum.FAT);
        this.carbsCalories = this.macroService.macroToCalories(this.carbs, MacroEnum.CARBS);
        this.proteinCalories = this.macroService.macroToCalories(this.protein, MacroEnum.PROTEIN);

        this.fatPercentage = this.helperDishService.calcMacroPercentage(MacroEnum.FAT, this.dish);
        this.carbsPercentage = this.helperDishService.calcMacroPercentage(MacroEnum.CARBS, this.dish);
        this.proteinPercentage = this.helperDishService.calcMacroPercentage(MacroEnum.PROTEIN, this.dish);


        this.chartData = [
            ['Fat', this.fatCalories],
            ['Carbs', this.carbsCalories],
            ['Protein', this.proteinCalories],
        ];

        this.loadBreakdownData();
    }

    onDishSelected(id: number): void {
        this.router.navigate(['manage-dishes', id]);
    }

    private loadBreakdownData(): void {
        this.dish.ingredients.forEach(ingredient => {
            this.breakdownData.push(this.breakdownService.convertIngredientForDish(ingredient, this.dish));
        });
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
}
