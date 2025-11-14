import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth/auth-service';
import { AuthComponent } from 'src/app/page/auth/auth';
import { provideRouter } from '@angular/router';
import { authServiceMock } from './mock/auth-service.mock';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from './mock/toast.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let toast: ToastService;
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let view: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthComponent);
    authService = TestBed.inject(AuthService);
    toast = TestBed.inject(ToastService);
    component = fixture.componentInstance;
    view = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Input isRegister', () => {
    it('Should isRegister true form register', () => {
      fixture.componentRef.setInput('isRegister', 'true');
      fixture.detectChanges();
      const titleForm = view.querySelector('h2');
      expect(component.isRegisterModel()).toBe(true);
      expect(titleForm?.textContent).toContain('Inscription');
    });
    it('Should isRegister false, form connexion', () => {
      fixture.componentRef.setInput('isRegister', 'otherValue');
      fixture.detectChanges();
      const titleForm = view.querySelector('h2');
      expect(component.isRegisterModel()).toBe(false);
      expect(titleForm?.textContent).toContain('Connexion');
    });
  });
  describe('Function Change form', () => {
    it('Should isRegister false, form Connexion, submit false', () => {
      component.changeForm(false);
      expect(component.isRegisterModel()).toBe(false);
      const titleForm = view.querySelector('h2');
      expect(titleForm?.textContent).toContain('Connexion');
      expect(component.isSubmit).toBe(false);
    });
    it('Should isRegister true, form Register, submit false', () => {
      component.changeForm(true);
      fixture.detectChanges();
      expect(component.isRegisterModel()).toBe(true);
      const titleForm = view.querySelector('h2');
      expect(titleForm?.textContent).toContain('Inscription');
      expect(component.isSubmit).toBe(false);
    });
  });
  describe('Function submitFormConnexion', () => {
    const connexionDTO = {
      identifier: 'test',
      password: 'StrongP@ssword73',
    };
    const eventClick = new Event('click');
    it('Should fail form not valid', () => {
      component.submitFormConnexion(eventClick);
      expect(component.isSubmit).toBe(true);
      expect(authService.signin).not.toHaveBeenCalled();
    });
    it('Should valid form with success toast', () => {
      component.formConnexion.setValue(connexionDTO);
      authServiceMock.signin.mockReturnValue(
        of({ message: 'Register success' }),
      );
      component.submitFormConnexion(eventClick);
      fixture.detectChanges();

      expect(component.isSubmit).toBe(true);
      expect(authService.signin).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should valid form with fail toast', () => {
      component.formConnexion.setValue(connexionDTO);
      authServiceMock.signin.mockReturnValue(
        throwError(() => ({
          status: 404,
          error: { message: 'Account not found' },
        })),
      );
      component.submitFormConnexion(eventClick);
      fixture.detectChanges();
      expect(component.isSubmit).toBe(true);
      expect(authService.signin).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
    });
  });
  describe('Function submitFormRegister', () => {
    const registerDTO = {
      lastName: 'lastName',
      firstName: 'firstName',
      username: 'username',
      email: 'email@gmail.com',
      password: 'StrongP@ssword73',
      confirmPassword: 'StrongP@ssword73',
      terme: true,
    };
    const eventClick = new Event('click');
    beforeEach(() => {
      component.changeForm(true);
      fixture.detectChanges();
    });
    it('Should fail form not valid', () => {
      component.submitFormRegister(eventClick);
      expect(component.isSubmit).toBe(true);
      expect(authService.signup).not.toHaveBeenCalled();
    });
    it('Should valid form with success toast', () => {
      component.formRegister.setValue(registerDTO);
      authServiceMock.signup.mockReturnValue(
        of({ message: 'Register success' }),
      );
      component.submitFormRegister(eventClick);
      fixture.detectChanges();
      expect(component.isSubmit).toBe(true);
      expect(authService.signup).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should valid form with fail toast', () => {
      component.formRegister.setValue(registerDTO);
      authServiceMock.signup.mockReturnValue(
        throwError(() => ({
          status: 404,
          error: { message: 'Account not found' },
        })),
      );
      component.submitFormRegister(eventClick);
      fixture.detectChanges();
      expect(component.isSubmit).toBe(true);
      expect(authService.signup).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
    });
  });
  describe('Form Connexion validator', () => {
    it('Should fail form not valid, password is required', () => {
      component.formConnexion.patchValue({});
      fixture.detectChanges();
      const password = component.formConnexion.controls['password'];
      expect(password.hasError('required')).toBeTruthy();
    });
    it('Should fail form not valid, identifier is required', () => {
      component.formConnexion.patchValue({});
      fixture.detectChanges();
      const identifier = component.formConnexion.controls['identifier'];
      expect(identifier.hasError('required')).toBeTruthy();
    });
  });
  describe('Form Register validator', () => {
    it('Verify validity field Last Name ', () => {
      component.formRegister.patchValue({});
      fixture.detectChanges();
      const lastName = component.formRegister.controls['lastName'];
      expect(lastName.hasError('required')).toBeTruthy();
      lastName.setValue('last name with more than 35 charactères');
      expect(lastName.hasError('maxlength')).toBeTruthy();
    });
    it('Verify validity field First Name ', () => {
      component.formRegister.patchValue({});
      fixture.detectChanges();
      const firstName = component.formRegister.controls['firstName'];
      expect(firstName.hasError('required')).toBeTruthy();
      firstName.setValue('last name with more than 35 charactères');
      expect(firstName.hasError('maxlength')).toBeTruthy();
    });
    it('Verify validity field Username ', () => {
      component.formRegister.patchValue({});
      fixture.detectChanges();
      const username = component.formRegister.controls['username'];
      expect(username.hasError('required')).toBeTruthy();
      username.setValue('o');
      expect(username.hasError('minlength')).toBeTruthy();
      username.setValue('last name with more than 35 charactères');
      expect(username.hasError('maxlength')).toBeTruthy();
    });
    it('Verify validity field email', () => {
      component.formRegister.patchValue({});
      fixture.detectChanges();
      const email = component.formRegister.controls['email'];
      expect(email.hasError('required')).toBeTruthy();
      email.setValue('email invalid');
      expect(email.hasError('email')).toBeTruthy();
      email.setValue(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam commodi, iure ducimus quo exercitationem iusto quis asperiores unde itaque, expedita aut, pariatur consectetur aliquid adipisci. Maiores dolore possimus, cupiditate officia aperiam, dolorum, quasi illo unde facilis corrupti deserunt inventore iure? Consequuntur vero culpa placeat?',
      );
      expect(email.hasError('maxlength')).toBeTruthy();
    });
    it('Verify validity field password', () => {
      component.formRegister.patchValue({});
      fixture.detectChanges();
      const password = component.formRegister.controls['password'];
      expect(password.hasError('required')).toBeTruthy();
      password.setValue('PASSWORD');
      expect(password.hasError('lowercase')).toBeTruthy();
      password.setValue('password');
      expect(password.hasError('uppercase')).toBeTruthy();
      password.setValue('Password');
      expect(password.hasError('number')).toBeTruthy();
      password.setValue('Password73');
      expect(password.hasError('symbol')).toBeTruthy();
      password.setValue('P@ssword73');
      expect(password.hasError('minlength')).toBeTruthy();
    });
    it('Verify validity field Confirm Password ', () => {
      const confirmPassword =
        component.formRegister.controls['confirmPassword'];
      confirmPassword.setValue('');
      expect(confirmPassword.hasError('required')).toBeTruthy();
      confirmPassword.setValue('StrongP@ssword733');
      const password = component.formRegister.controls['password'];
      password.setValue('Other P@ssword73');
      expect(component.formRegister.hasError('notSamePassword')).toBeTruthy();
    });
  });
});
