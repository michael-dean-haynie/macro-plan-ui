import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppComponent } from './app.component';
import { ManageFoodDetailsComponent } from './components/manage-food-details/manage-food-details.component';
import { ManageFoodComponent } from './components/manage-food/manage-food.component';

const appRoutes: Routes = [
  {
    path: 'manage-food', component: ManageFoodComponent
  },
  {
    path: '',
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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
