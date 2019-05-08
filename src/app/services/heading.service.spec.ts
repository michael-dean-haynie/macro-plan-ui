import { TestBed } from '@angular/core/testing';

import { HeadingService } from './heading.service';

describe('HeadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeadingService = TestBed.get(HeadingService);
    expect(service).toBeTruthy();
  });
});
