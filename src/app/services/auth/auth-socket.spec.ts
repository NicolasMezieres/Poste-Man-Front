import { TestBed } from '@angular/core/testing';
import { AuthSocketService } from './auth-socket';
import { socketMock } from '../message/mock/socket.mock';

describe('AuthSocketService', () => {
  let service: AuthSocketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSocketService],
    });
    service = TestBed.inject(AuthSocketService);
    service['socket'] = socketMock;
  });
  describe('listenToException', () => {
    it('Should disconnect', () => {});
  });
  describe('authSocket', () => {
    it('Should emit auth', () => {});
    it('Should nothing already auth', () => {});
  });
  describe('connectedListMember', () => {
    it('Should return list member', () => {});
  });
  describe('listenAuth', () => {
    it('Should return when server emit online', () => {});
    it('Should return when server emit offline', () => {});
    it('Should return when server emit userJoinProject', () => {});
    it('Should return when server emit userLeaveProject', () => {});
  });
});
