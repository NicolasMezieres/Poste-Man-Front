import { TestBed } from '@angular/core/testing';
import { MessageSocketService } from './message-socket';
import { socketMock } from './mock/socket.mock';
import { Socket } from 'socket.io-client';
describe('MessageSocketService', () => {
  let service: MessageSocketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageSocketService],
    });
    service = TestBed.inject(MessageSocketService);
    service['socket'] = socketMock;
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('Function listen to exception', () => {
    it('Should received an error and disconnect communication', () => {
      service.listenToException();
      expect(service['socket'].disconnect).toHaveBeenCalled();
      expect(service['socket'].io.opts.reconnection).toEqual(false);
    });
  });
  describe('Function join room', () => {
    it('Should emit messageJoinRoom', () => {
      service.joinRoom('projectId');
      expect(service['socket'].emit).toHaveBeenCalledWith(
        'messageJoinRoom',
        'projectId',
      );
    });
  });
  describe('Function listen message', () => {
    it('Shoud listen new message', () => {
      jest.spyOn(service['socket'], 'on').mockImplementation(
        (e: string, cb: (data: { action: string; message: string }) => void) =>
          cb({
            action: 'create',
            message: 'new message',
          }) as unknown as Socket,
      );
      service.listenMessage().subscribe((data) => {
        expect(data.message).toEqual('new message');
      });
    });
    it('Shoud disconnect communication', () => {
      service.listenMessage().subscribe().unsubscribe();
      expect(service['socket'].disconnect).toHaveBeenCalled();
    });
  });
});
