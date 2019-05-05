import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSummaryCardComponent } from './plan-summary-card.component';

describe('PlanSummaryCardComponent', () => {
  let component: PlanSummaryCardComponent;
  let fixture: ComponentFixture<PlanSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
