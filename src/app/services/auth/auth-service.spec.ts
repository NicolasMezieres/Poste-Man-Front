import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth/auth-service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Signup', () => {
    const registerDTO = {
      lastName: 'lastName',
      firstName: 'firstName',
      username: 'username',
      email: 'email@gmail.com',
      password: 'StrongP@ssword73',
      confirmPassword: 'StrongP@ssword73',
      terme: true,
    };
    it('Should register success', () => {
      service.signup(registerDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/signup');
      expect(req.request.method).toEqual('POST');
      req.flush({ message: 'Connexion' });
    });
    it('Should register fail', () => {
      service.signup(registerDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/signup');
      expect(req.request.method).toEqual('POST');
      req.flush(null, { status: 401, statusText: 'username already used' });
    });
  });
  describe('Signin', () => {
    const signinDTO = { identifier: 'test', password: 'StrongP@ssword73' };
    it('Should Connexion succes', () => {
      service.signin(signinDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/signin');
      expect(req.request.method).toEqual('POST');
      req.flush({ message: 'Connexion', role: 'role' });
    });
    it('Should Connexion fail', () => {
      service.signin(signinDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/signin');
      expect(req.request.method).toEqual('POST');
      req.flush(null, { status: 404, statusText: 'Not found' });
    });
  });
  describe('Activ Account', () => {
    const token = 'token';
    it('Should active account', () => {
      service.activAccount(token).subscribe();
      const req = http.expectOne(
        environment.apiURL + 'auth/activationAccount/' + token,
      );
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'Connexion' });
    });
    it('Should fail active account', () => {
      service.activAccount(token).subscribe();
      const req = http.expectOne(
        environment.apiURL + 'auth/activationAccount/' + token,
      );
      expect(req.request.method).toEqual('PATCH');
      req.flush(null, { statusText: 'Account not found', status: 404 });
    });
  });
  describe('forget Password', () => {
    it('Should Success', () => {
      service.forgetPassword({ email: 'email@gmail.com' }).subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/forgetPassword');
      expect(req.request.method).toEqual('POST');
      req.flush({ message: 'A mail was send.' });
    });
  });
  describe('Reset Password', () => {
    it('Should Succes', () => {
      service
        .resetPassword('token', {
          password: 'password',
          confirmPassword: 'password',
        })
        .subscribe();
      const req = http.expectOne(
        environment.apiURL + 'auth/resetPasswordWithToken',
      );
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'Password changed successfuly' });
    });
    it('Should fail', () => {
      service
        .resetPassword('token', {
          password: 'password',
          confirmPassword: 'password',
        })
        .subscribe(throwError);
      const req = http.expectOne(
        environment.apiURL + 'auth/resetPasswordWithToken',
      );
      expect(req.request.method).toEqual('PATCH');
      req.flush(null, {
        status: 401,
        statusText: 'Unauthorized',
      });
    });
  });
  describe('Logout', () => {
    it('Should success, navigate to auth page', () => {
      service.logout().subscribe();
      const req = http.expectOne(environment.apiURL + 'auth/logout');
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'logout' });
    });
  });
});
