import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppComponent } from './app.component';
import { ManageFoodComponent } from './components/manage-food/manage-food.component';

@NgModule({
  declarations: [
    AppComponent,
    ManageFoodComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    // Google Charts
    GoogleChartsModule,

    // Material2 Modules
    BrowserAnimationsModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
