import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSummaryCardComponent } from './food-summary-card.component';

describe('FoodSummaryCardComponent', () => {
  let component: FoodSummaryCardComponent;
  let fixture: ComponentFixture<FoodSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
