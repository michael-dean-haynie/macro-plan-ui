import { TestBed } from '@angular/core/testing';

import { ApiPlanService } from './api-plan.service';

describe('ApiPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiPlanService = TestBed.get(ApiPlanService);
    expect(service).toBeTruthy();
  });
});
