import { TestBed } from '@angular/core/testing';
import { socketMock } from '../message/mock/socket.mock';
import { PostSocketService } from './post-socket';
import { postType } from 'src/app/utils/type';
import { postMock } from 'src/app/component/modal/post/mock/post-mock';
import { Socket } from 'socket.io-client';

describe('PostSocketService', () => {
  let service: PostSocketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostSocketService],
    });
    service = TestBed.inject(PostSocketService);
    service['socket'] = socketMock;
  });
  it('Should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('listen To Exception', () => {
    it('Should disconnect socket', () => {
      service.listenToException();
      expect(service['socket'].disconnect).toHaveBeenCalled();
      expect(service['socket'].io.opts.reconnection).toEqual(false);
      expect(service['socket'].on).toHaveBeenCalled();
    });
  });
  describe('listen Post', () => {
    it('Should listen action post', () => {
      jest
        .spyOn(service['socket'], 'on')
        .mockImplementation(
          (e: string, cb: (data: { action: string; post: postType }) => void) =>
            cb({ action: 'create', post: postMock }) as unknown as Socket,
        );
      service.listenPost().subscribe((data) => {
        expect(data.post).toEqual(postMock);
      });
    });
    it('Should disconnect communication', () => {
      service.listenPost().subscribe().unsubscribe();
      expect(service['socket'].disconnect).toHaveBeenCalled();
    });
  });
  describe('join Room', () => {
    it('Should emit joinRoom', () => {
      const projectId = 'projectId';
      service.joinRoom(projectId);
      expect(service['socket'].emit).toHaveBeenCalledWith(
        'postJoinRoom',
        projectId,
      );
    });
  });
});
