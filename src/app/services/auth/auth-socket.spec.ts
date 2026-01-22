import { TestBed } from '@angular/core/testing';
import { AuthSocketService } from './auth-socket';
import { socketMock } from '../message/mock/socket.mock';
import { Socket } from 'socket.io-client';
import { member } from 'src/app/utils/type';

describe('AuthSocketService', () => {
  let service: AuthSocketService;
  let socket: Socket;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSocketService],
    });
    service = TestBed.inject(AuthSocketService);
    service['socket'] = socketMock;
    socket = service['socket'];
  });
  afterEach(() => jest.clearAllMocks());
  describe('listenToException', () => {
    it('Should received an error and disconnect communication', () => {
      service.listenToException();
      expect(service['socket'].disconnect).toHaveBeenCalled();
      expect(service['socket'].io.opts.reconnection).toEqual(false);
    });
  });
  describe('authSocket', () => {
    it('Should emit auth', () => {
      socket.connected = false;
      jest.spyOn(socket, 'connect');
      jest.spyOn(socket, 'emit');
      service.authSocket();
      expect(socket.connect).toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith('auth');
    });
    it('Should nothing already auth', () => {
      socket.connected = true;
      jest.spyOn(socket, 'connect');
      jest.spyOn(socket, 'emit');
      service.authSocket();
      expect(socket.connect).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });
  });
  describe('connectedListMember', () => {
    it('Should return list member', () => {
      jest.spyOn(service, 'authSocket');
      jest.spyOn(socket, 'emitWithAck');
      service.connectedListMember('projectId');
      expect(service.authSocket).toHaveBeenCalled();
      expect(socket.emitWithAck).toHaveBeenCalledWith(
        'listMember',
        'projectId',
      );
    });
  });
  describe('listenAuth', () => {
    it('Should return when server emit auth', () => {
      const emitData = { action: 'online', userId: 'userId' };
      jest.spyOn(service['socket'], 'on').mockImplementation(
        (
          e: string,
          cb: (data: {
            userId: string;
            member?: member;
            action: string;
          }) => void,
        ) =>
          cb({
            ...emitData,
          }) as unknown as Socket,
      );
      service.listenAuth().subscribe((data) => {
        expect(data).toEqual(emitData);
      });
    });
  });
});
