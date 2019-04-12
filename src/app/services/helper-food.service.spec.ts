import { TestBed } from '@angular/core/testing';

import { HelperFoodService } from './helper-food.service';

describe('HelperFoodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelperFoodService = TestBed.get(HelperFoodService);
    expect(service).toBeTruthy();
  });
});
