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
});
