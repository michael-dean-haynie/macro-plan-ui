import { TestBed } from '@angular/core/testing';

import { ApiUnitService } from './api-unit.service';

describe('ApiUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiUnitService = TestBed.get(ApiUnitService);
    expect(service).toBeTruthy();
  });
});
