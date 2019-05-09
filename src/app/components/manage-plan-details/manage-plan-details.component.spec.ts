import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePlanDetailsComponent } from './manage-plan-details.component';

describe('ManagePlanDetailsComponent', () => {
  let component: ManagePlanDetailsComponent;
  let fixture: ComponentFixture<ManagePlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePlanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
