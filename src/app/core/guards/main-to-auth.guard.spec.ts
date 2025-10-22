import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mainToAuthGuard } from './main-to-auth.guard';

describe('mainToAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mainToAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
