import { TestBed } from '@angular/core/testing';

import { ApiDishService } from './api-dish.service';

describe('ApiDishService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiDishService = TestBed.get(ApiDishService);
    expect(service).toBeTruthy();
  });
});
