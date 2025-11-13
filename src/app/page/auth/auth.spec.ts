import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth/auth-service';
import { AuthComponent } from 'src/app/page/auth/auth';
import { provideRouter } from '@angular/router';
import { authServiceMock } from './mock/auth-service.mock';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let view: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthComponent);
    authService = TestBed.inject(AuthService);
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
    it('Should valid form ', () => {
      component.formConnexion.setValue(connexionDTO);
      authServiceMock.signin.mockReturnValue({
        subscribe: jest.fn(),
      });
      fixture.detectChanges();
      component.submitFormConnexion(eventClick);
      expect(component.isSubmit).toBe(true);
      expect(authService.signin).toHaveBeenCalled();
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
    beforeEach(() => {
      component.changeForm(true);
      fixture.detectChanges();
    });
    it('Should fail form not valid', () => {
      const buttonSubmit: HTMLElement | null =
        view.querySelector('#submitInscription');
      buttonSubmit?.click();
      expect(component.isSubmit).toBe(true);
      expect(authService.signup).not.toHaveBeenCalled();
    });
    it('Should valid form', () => {
      component.formRegister.setValue(registerDTO);
      authServiceMock.signup.mockReturnValue(of());
      fixture.detectChanges();
      const buttonSubmit: HTMLElement | null =
        view.querySelector('#submitInscription');
      buttonSubmit?.click();
      expect(component.isSubmit).toBe(true);
      expect(authService.signup).toHaveBeenCalled();
    });
  });
});
