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
    FormsModule,

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
