import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MacroEnum } from 'src/app/enums/macro.enum';
import { Dish } from 'src/app/models/api/dish.model';
import { Measurement } from 'src/app/models/api/measurement.model';
import { MacroService } from 'src/app/services/macro.service';
import { HelperDishService } from './../../services/helper-dish.service';

export interface BreakdownIngredient {
    name: string;
    measurement: Measurement[];
    calories: number;
    caloriesPercentage: number;
    fat: number;
    fatCalories: number;
    fatPercentage: number;
    carbs: number;
    carbsCalories: number;
    carbsPercentage: number;
    protein: number;
    proteinCalories: number;
    proteinPercentage: number
}

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
    breakdownData: BreakdownIngredient[] = [];

    constructor(
        private router: Router,
        private helperDishService: HelperDishService,
        private macroService: MacroService) { }

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

            // fat
            const fat = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.FAT);
            const fatCalories = this.macroService.macroToCalories(fat, MacroEnum.FAT);
            const fatPercentage = this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.FAT, this.dish);

            // carbs
            const carbs = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.CARBS);
            const carbsCalories = this.macroService.macroToCalories(carbs, MacroEnum.CARBS);
            const carbsPercentage = this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.CARBS, this.dish);

            // protein
            const protein = this.helperDishService.calcIngredientIndividualMacro(ingredient, MacroEnum.PROTEIN);
            const proteinCalories = this.macroService.macroToCalories(protein, MacroEnum.PROTEIN);
            const proteinPercentage = this.helperDishService.calcIngredientMacroCaloriesPercentage(ingredient, MacroEnum.PROTEIN, this.dish);

            const breakdownIngredient: BreakdownIngredient = {
                name: ingredient.food.name,
                measurements: [ingredient.measurement],

                // calories
                calories: this.helperDishService.calcIngredientCalories(ingredient),
                caloriesPercentage: this.helperDishService.calcIngredientCaloriesPercentage(ingredient, this.dish),

                // fat
                fat: fat,
                fatCalories: fatCalories,
                fatPercentage: fatPercentage,

                // carbs
                carbs: carbs,
                carbsCalories: carbsCalories,
                carbsPercentage: carbsPercentage,

                // protein
                protein: protein,
                proteinCalories: proteinCalories,
                proteinPercentage: proteinPercentage,
            };
            this.breakdownData.push(breakdownIngredient);
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
