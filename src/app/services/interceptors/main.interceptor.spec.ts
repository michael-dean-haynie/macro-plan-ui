import { TestBed } from '@angular/core/testing';

import { MainInterceptor } from './main.interceptor';

describe('MainInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainInterceptor = TestBed.get(MainInterceptor);
    expect(service).toBeTruthy();
  });
});
