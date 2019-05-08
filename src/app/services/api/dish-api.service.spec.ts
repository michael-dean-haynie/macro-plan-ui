import { TestBed } from '@angular/core/testing';
import { DishApiService } from './dish-api.service';


describe('DishApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishApiService = TestBed.get(DishApiService);
    expect(service).toBeTruthy();
  });
});
