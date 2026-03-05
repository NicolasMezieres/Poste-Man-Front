import { TestBed } from '@angular/core/testing';

import { UserService } from './user';
import { environment } from 'src/environments/environment';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Get my Account', () => {
    it('Should register success', () => {
      service.myAccount().subscribe();
      const req = http.expectOne(environment.apiURL + 'user/myAccount');
      expect(req.request.method).toEqual('GET');
      req.flush({ message: 'Connexion' });
    });
    it('Should register fail', () => {
      service.myAccount().subscribe();
      const req = http.expectOne(environment.apiURL + 'user/myAccount');
      expect(req.request.method).toEqual('GET');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
  describe('(PATCH) update my Account', () => {
    const myAccountDTO = {
      firstName: 'bidule',
      lastName: 'Chouette',
      username: 'roucoups',
      email: 'email@gmail.com',
    };
    it('My account updated !', () => {
      service.updateMyAccount(myAccountDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'user/myAccount');
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'Connexion' });
    });
    it('Update fail', () => {
      service.updateMyAccount(myAccountDTO).subscribe();
      const req = http.expectOne(environment.apiURL + 'user/myAccount');
      expect(req.request.method).toEqual('PATCH');
      req.flush(null, { status: 401, statusText: 'email' });
    });
  });
  describe('changePassword', () => {
    it('password change', () => {
      service
        .changePassword({
          password: 'StrongP@ssword73',
          oldPassword: 'OldStrongP@ssword73',
          confirmPassword: 'StrongP@ssword73',
        })
        .subscribe();
      const req = http.expectOne(environment.apiURL + 'user/changePassword');
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'password change' });
    });
  });
  describe('delete Account', () => {
    it('Account deleted', () => {
      service.deleteAccount().subscribe();
      const req = http.expectOne(
        environment.apiURL + 'user/account/desactivate',
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'account deleted' });
    });
  });
  describe('Search User', () => {
    it('Get list user', () => {
      service.searchUser({ isActive: true, page: 1, search: 'a' }).subscribe();
      const req = http.expectOne(
        environment.apiURL + 'user/userList?search=a&page=1&isActive=true',
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ data: 'List user' });
    });
  });
  describe('change Avatar', () => {
    it('Avatar changed', () => {
      service.changeAvatar('cat').subscribe();
      const req = http.expectOne(environment.apiURL + 'user/changeAvatar');
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'Avatar changed' });
    });
  });
  describe('Get User', () => {
    it('Get detail user', () => {
      service.getUser('userId').subscribe();
      const req = http.expectOne(environment.apiURL + 'user/userId/detail');
      expect(req.request.method).toEqual('GET');
      req.flush({ data: 'Detail User' });
    });
  });
  describe('Ban User', () => {
    it('Should ban user', () => {
      service.banUser('userId').subscribe();
      const req = http.expectOne(environment.apiURL + 'user/userId/ban');
      expect(req.request.method).toEqual('PATCH');
      req.flush({ message: 'succes' });
    });
  });
  describe('Delete User', () => {
    it('Should delete user', () => {
      service.deleteUser('userId').subscribe();
      const req = http.expectOne(environment.apiURL + 'user/userId/delete');
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'User deleted' });
    });
  });
});
