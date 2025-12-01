import { TestBed } from '@angular/core/testing';
import { MessageSocketService } from './message-socket';
import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { assert } from 'chai';
describe('MessageSocketService', () => {
  let service: MessageSocketService;
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Function listen to exception', () => {
    it('Should received an error and disconnect communication', () => {});
  });
});
