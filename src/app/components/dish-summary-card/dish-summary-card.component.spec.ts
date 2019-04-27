import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishSummaryCardComponent } from './dish-summary-card.component';

describe('DishSummaryCardComponent', () => {
  let component: DishSummaryCardComponent;
  let fixture: ComponentFixture<DishSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
