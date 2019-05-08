import { TestBed } from '@angular/core/testing';
import { FoodApiService } from './food-api.service';


describe('FoodApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodApiService = TestBed.get(FoodApiService);
    expect(service).toBeTruthy();
  });
});
