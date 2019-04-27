import { TestBed } from '@angular/core/testing';

import { HelperDishService } from './helper-dish.service';

describe('HelperDishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelperDishService = TestBed.get(HelperDishService);
    expect(service).toBeTruthy();
  });
});
