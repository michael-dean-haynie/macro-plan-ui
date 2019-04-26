import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppComponent } from './app.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ManageFoodDetailsComponent } from './components/manage-food-details/manage-food-details.component';
import { ManageFoodComponent } from './components/manage-food/manage-food.component';
import { MeasurementsPipe } from './pipes/measurements.pipe';
import { MainInterceptor } from './services/interceptors/main.interceptor';
import { ManageDishesComponent } from './components/manage-dishes/manage-dishes.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';



const appRoutes: Routes = [
  {
    path: 'manage-food', component: ManageFoodComponent
  },
  {
    path: 'manage-food/:id', component: ManageFoodDetailsComponent
  },
  {
    path: 'manage-dishes', component: ManageDishesComponent
  },
  // {
  //   path: 'manage-dishes/:id', component: ManageDishDetailsComponent
  // },
  {
    path: '',
    redirectTo: '/manage-food',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/manage-food',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ManageFoodComponent,
    ManageFoodDetailsComponent,
    DialogComponent,
    MeasurementsPipe,
    ManageDishesComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),

    // Google Charts
    GoogleChartsModule,

    // Material2 Modules
    BrowserAnimationsModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatMenuModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MainInterceptor,
    multi: true,
  },],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class AppModule { }
