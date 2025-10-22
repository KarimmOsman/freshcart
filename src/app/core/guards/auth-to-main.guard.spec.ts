import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authToMainGuard } from './auth-to-main.guard';

describe('authToMainGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authToMainGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
