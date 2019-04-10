import { TestBed } from '@angular/core/testing';

import { ApiFoodService } from './api-food.service';

describe('ApiFoodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiFoodService = TestBed.get(ApiFoodService);
    expect(service).toBeTruthy();
  });
});
