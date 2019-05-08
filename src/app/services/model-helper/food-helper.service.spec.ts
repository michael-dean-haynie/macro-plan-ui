import { TestBed } from '@angular/core/testing';
import { FoodHelperService } from './food-helper.service';


describe('FoodHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodHelperService = TestBed.get(FoodHelperService);
    expect(service).toBeTruthy();
  });
});
