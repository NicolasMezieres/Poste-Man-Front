import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ToastService } from 'src/app/services/toast/toast';

import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from './mock/auth-service.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: null },
        { provide: HttpClient, useValue: null },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
