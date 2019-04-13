import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFoodDetailsComponent } from './manage-food-details.component';

describe('ManageFoodDetailsComponent', () => {
  let component: ManageFoodDetailsComponent;
  let fixture: ComponentFixture<ManageFoodDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFoodDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFoodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
