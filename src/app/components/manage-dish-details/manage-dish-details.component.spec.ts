import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDishDetailsComponent } from './manage-dish-details.component';

describe('ManageDishDetailsComponent', () => {
  let component: ManageDishDetailsComponent;
  let fixture: ComponentFixture<ManageDishDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDishDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDishDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
