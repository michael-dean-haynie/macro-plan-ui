import { TestBed } from '@angular/core/testing';
import { UnitHelperService } from './unit-helper.service';


describe('UnitHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitHelperService = TestBed.get(UnitHelperService);
    expect(service).toBeTruthy();
  });
});
