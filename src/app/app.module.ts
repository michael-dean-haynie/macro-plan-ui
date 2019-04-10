import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

    // Material2 Modules
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
