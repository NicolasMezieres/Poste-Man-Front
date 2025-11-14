import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidAccountComponent } from './valid-account';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthComponent } from '../auth/auth';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from '../auth/mock/auth-service.mock';
import { of, throwError } from 'rxjs';

describe('ValidAccountComponent', () => {
  let component: ValidAccountComponent;
  let fixture: ComponentFixture<ValidAccountComponent>;
  let router: Router;
  let toast: ToastService;
  let auth: AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidAccountComponent],
      providers: [
        provideRouter([{ path: 'auth', component: AuthComponent }]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ValidAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    toast = TestBed.inject(ToastService);
    auth = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function Navigate', () => {
    it('Should navigate to page Auth', () => {
      jest.useFakeTimers();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.navigate();
      jest.advanceTimersByTime(3000);
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('Function Active Account', () => {
    it('Should fail not found token', () => {
      jest.spyOn(component, 'navigate').mockReturnValue();
      component.activeAccount();
      expect(component.isError()).toBe(true);
      expect(component.message()).toContain('Token incorrect');
      expect(component.navigate).toHaveBeenCalled();
    });
    it('Should fail token invalid', () => {
      jest.spyOn(component, 'navigate').mockReturnValue();
      jest.spyOn(auth, 'activAccount').mockReturnValue(
        throwError(() => ({
          status: 404,
          error: {
            message: 'Account not found',
          },
        })),
      );
      component.token = 'invalid token';
      component.activeAccount();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(component.isError()).toBe(true);
      expect(component.message()).toContain('Token invalid');
      expect(component.navigate).toHaveBeenCalled();
    });
    it('Should success valid account', () => {
      jest.spyOn(component, 'navigate').mockReturnValue();
      jest
        .spyOn(auth, 'activAccount')
        .mockReturnValue(of({ message: 'Account activated' }));
      component.token = 'valid token';
      component.activeAccount();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.isError()).toBe(false);
      expect(component.message()).toContain('Compte validé');
      expect(component.navigate).toHaveBeenCalled();
    });
  });
});
