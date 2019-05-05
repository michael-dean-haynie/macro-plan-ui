import { TestBed } from '@angular/core/testing';

import { BreakdownService } from './breakdown.service';

describe('BreakdownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreakdownService = TestBed.get(BreakdownService);
    expect(service).toBeTruthy();
  });
});
