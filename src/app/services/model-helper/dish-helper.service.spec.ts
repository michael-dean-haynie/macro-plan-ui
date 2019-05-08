import { TestBed } from '@angular/core/testing';
import { DishHelperService } from './dish-helper.service';


describe('DishHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishHelperService = TestBed.get(DishHelperService);
    expect(service).toBeTruthy();
  });
});
