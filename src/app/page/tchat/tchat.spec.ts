import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TchatComponent } from './tchat';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'src/app/services/message/message';
import { messageServiceMock } from './mock/message-service.mock';
import { MessageSocketService } from 'src/app/services/message/message-socket';
import { messageSocketMock } from './mock/message-socket.mock';
import { ToastService } from 'src/app/services/toast/toast';
import { of, throwError } from 'rxjs';
import { toastMock } from '../auth/mock/toast.mock';

describe('TchatComponent', () => {
  let component: TchatComponent;
  let fixture: ComponentFixture<TchatComponent>;
  let toast: ToastService;
  let router: Router;
  let route: ActivatedRoute;
  let messageService: MessageService;
  let messageSocket: MessageSocketService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TchatComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: MessageService, useValue: messageServiceMock },
        { provide: MessageSocketService, useValue: messageSocketMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TchatComponent);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    route = TestBed.inject(ActivatedRoute);
    messageSocket = TestBed.inject(MessageSocketService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function ng On Init', () => {
    const resData = {
      data: [
        {
          id: 'id',
          message: 'message',
          user: {
            username: 'username',
            createdAt: 'date',
            updatedAt: 'date',
          },
        },
      ],
      isModerator: true,
      user: 'username',
    };
    it('Get messages of project success ', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of(resData));
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of());

      component.ngOnInit();
      expect(messageService.getProjectMessages).toHaveBeenCalled();
      expect(component.messages()).toEqual(resData.data);
      expect(component.username()).toEqual('username');
      expect(component.isModerator()).toEqual(true);
      expect(messageSocket.joinRoom).toHaveBeenCalled();
    });
    it('Should fail messages of project, Unauthorized', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(
        throwError(() => ({ status: 401 })),
      );
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of());
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(messageService.getProjectMessages).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail messages of project, Forbidden', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(
        throwError(() => ({ status: 403 })),
      );
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of());
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(messageService.getProjectMessages).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail messages of project, Not Found', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(
        throwError(() => ({ status: 404 })),
      );
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of());
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(messageService.getProjectMessages).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Params not found, navigate to page presentation', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of());
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
  describe('socket subscription', () => {
    const resData = {
      data: [
        {
          id: 'id',
          message: 'message',
          user: {
            username: 'username',
            createdAt: 'date',
            updatedAt: 'date',
          },
        },
      ],
      isModerator: true,
      user: 'username',
    };
    it('a message was send', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of());
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(
        of({ action: 'create', message: 'bidule' }),
      );
      component.ngOnInit();
      expect(component.messages()).toEqual(['bidule']);
    });
    it('a message was delete', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of(resData));
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(
        of({ action: 'delete', message: { id: 'id' } }),
      );
      component.ngOnInit();
      expect(component.messages()).toEqual([]);
    });
    it('a message was reset', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of(resData));
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of({ action: 'reset' }));
      component.ngOnInit();
      expect(component.messages()).toEqual([]);
    });
    it('a message with other action', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of());
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(
        of({ action: 'other action' }),
      );
      component.ngOnInit();
      expect(component.messages()).toEqual([]);
    });
    it('a message was send', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(of());
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(throwError(() => {}));
      component.ngOnInit();
    });
  });
  describe('Function submit form message', () => {
    const clickEvent = new Event('click');
    it('form is invalid', () => {
      component.submitFormMessage(clickEvent);
      expect(messageService.createMessage).not.toHaveBeenCalled();
    });
    it('form is valid, message was created', () => {
      jest
        .spyOn(messageService, 'createMessage')
        .mockReturnValue(of({ message: 'created' }));
      jest.spyOn(toast, 'openSuccesToast').mockReturnValue();
      component.formMessage.patchValue({ message: 'message' });
      component.submitFormMessage(clickEvent);
      expect(messageService.createMessage).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('form is valid, fail Unauthorized', () => {
      jest
        .spyOn(messageService, 'createMessage')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      component.formMessage.patchValue({ message: 'message' });
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitFormMessage(clickEvent);
      expect(messageService.createMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('form is valid, fail not found', () => {
      jest
        .spyOn(messageService, 'createMessage')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      component.formMessage.patchValue({ message: 'message' });
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitFormMessage(clickEvent);
      expect(messageService.createMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
