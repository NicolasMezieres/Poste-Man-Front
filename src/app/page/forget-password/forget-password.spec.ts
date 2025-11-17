import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordComponent } from './forget-password';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from '../auth/mock/auth-service.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswordComponent],
      providers: [
        { provide: ToastService, useValue: toastMock },
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Validation Form Forget Password', () => {
    it('Validation field email', () => {
      component.formForgetPassword.patchValue({});
      fixture.detectChanges();
      const email = component.formForgetPassword.controls['email'];
      expect(email.hasError('required')).toBeTruthy();
      email.setValue('email');
      expect(email.hasError('email')).toBeTruthy();
    });
  });
  describe('Function submit Form Forget Password', () => {
    const eventClick = new Event('click');
    it('Should fail form not valid', () => {
      component.formForgetPassword.patchValue({});
      fixture.detectChanges();
      component.submitFormForgetPassword(eventClick);
      expect(component.isSubmit()).toBe(true);
      expect(authServiceMock.forgetPassword).not.toHaveBeenCalled();
    });
    it('Should return error http', () => {
      component.formForgetPassword.patchValue({ email: 'email@example.com' });
      authServiceMock.forgetPassword.mockReturnValue(
        throwError(() => ({
          status: 401,
          error: { message: 'Account not activate' },
        })),
      );
      fixture.detectChanges();
      component.submitFormForgetPassword(eventClick);
      expect(component.isSubmit()).toBe(true);
      expect(authServiceMock.forgetPassword).toHaveBeenCalled();
      expect(toastMock.openFailToast).toHaveBeenCalled();
    });
    it('Should send an mail and redirect to page auth', () => {
      component.formForgetPassword.patchValue({ email: 'email@example.com' });
      authServiceMock.forgetPassword.mockReturnValue(
        of({ message: 'Check your email' }),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      fixture.detectChanges();
      component.submitFormForgetPassword(eventClick);
      expect(component.isSubmit()).toBe(true);
      expect(authServiceMock.forgetPassword).toHaveBeenCalled();
      expect(toastMock.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
});
