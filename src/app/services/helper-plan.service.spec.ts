import { TestBed } from '@angular/core/testing';

import { HelperPlanService } from './helper-plan.service';

describe('HelperPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelperPlanService = TestBed.get(HelperPlanService);
    expect(service).toBeTruthy();
  });
});
