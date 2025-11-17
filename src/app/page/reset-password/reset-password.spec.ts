import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password';
import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from '../auth/mock/auth-service.mock';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let router: Router;
  let route: ActivatedRoute;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastMock },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ResetPasswordComponent);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('Token is not empty', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('token');
      component.ngOnInit();
      expect(component.token).toEqual('token');
    });
    it('Token is empty fail', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
  describe('Submit Form Reset Password', () => {
    const eventClick = new Event('click');
    it('Should fail form not valid', () => {
      component.formResetPassword.patchValue({});
      component.submitFormResetPassword(eventClick);
      expect(component.isSubmit()).toEqual(true);
      expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
    });
    it('Should form valid but error response', () => {
      component.formResetPassword.patchValue({
        confirmPassword: 'StrongP@ssword73',
        password: 'StrongP@ssword73',
      });
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest
        .spyOn(authServiceMock, 'resetPassword')
        .mockReturnValue(throwError(() => ({ error: { message: 'error' } })));
      component.submitFormResetPassword(eventClick);
      expect(component.isSubmit()).toEqual(true);
      expect(authServiceMock.resetPassword).toHaveBeenCalled();
      expect(toastMock.openFailToast).toHaveBeenCalled();
    });
    it('Should form valid but error serveur', () => {
      component.formResetPassword.patchValue({
        confirmPassword: 'StrongP@ssword73',
        password: 'StrongP@ssword73',
      });
      jest.spyOn(authServiceMock, 'resetPassword').mockReturnValue(
        throwError(() => ({
          status: 500,
          error: { message: 'error serveur' },
        })),
      );
      component.submitFormResetPassword(eventClick);
      expect(component.isSubmit()).toEqual(true);
      expect(authServiceMock.resetPassword).toHaveBeenCalled();
      expect(toastMock.openFailToast).toHaveBeenCalled();
    });
    it('Should form valid with succes', () => {
      component.formResetPassword.patchValue({
        confirmPassword: 'StrongP@ssword73',
        password: 'StrongP@ssword73',
      });
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest
        .spyOn(authServiceMock, 'resetPassword')
        .mockReturnValue(of({ message: 'error' }));
      component.submitFormResetPassword(eventClick);
      expect(component.isSubmit()).toEqual(true);
      expect(authServiceMock.resetPassword).toHaveBeenCalled();
      expect(toastMock.openSuccesToast).toHaveBeenCalled();
    });
  });
});
