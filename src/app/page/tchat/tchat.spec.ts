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
import { MatDialogRef } from '@angular/material/dialog';
import { dialogDeleteMessageComponent } from 'src/app/component/modal/message/delete-message/delete-message';

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
    component = fixture.componentInstance;
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    route = TestBed.inject(ActivatedRoute);
    messageSocket = TestBed.inject(MessageSocketService);
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
      messageServiceMock.getProjectName.mockReturnValue(of());
      component.ngOnInit();
      expect(messageService.getProjectMessages).toHaveBeenCalled();
      expect(component.messages()).toEqual(resData.data);
      expect(messageSocket.joinRoom).toHaveBeenCalled();
    });
    it('Should fail messages of project, Unauthorized', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectMessages.mockReturnValue(
        throwError(() => ({ status: 401 })),
      );
      messageServiceMock.getProjectName.mockReturnValue(of());
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
      messageServiceMock.getProjectName.mockReturnValue(of());
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
      messageServiceMock.getProjectName.mockReturnValue(of());
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
    it('a message was create', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectName.mockReturnValue(of());
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
      messageServiceMock.getProjectName.mockReturnValue(of());
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
      messageServiceMock.getProjectName.mockReturnValue(of());
      messageServiceMock.getProjectMessages.mockReturnValue(of(resData));
      messageSocketMock.joinRoom.mockReturnValue(of());
      messageSocketMock.listenMessage.mockReturnValue(of({ action: 'reset' }));
      component.ngOnInit();
      expect(component.messages()).toEqual([]);
    });
    it('a message with other action', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      messageServiceMock.getProjectName.mockReturnValue(of());
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
      messageServiceMock.getProjectName.mockReturnValue(of());
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
  describe('Function on Scroll', () => {
    it('Should scroll', () => {
      jest.useFakeTimers();
      jest.spyOn(component, 'getMessages').mockReturnValue();
      component.onScroll();
      jest.advanceTimersByTime(component.throttleGetMessage);
      expect(component.isLoadingMessage()).toBe(true);
    });
  });
  describe('getProjectName', () => {
    const projectId = 'projectId';
    it('Should success member', () => {
      jest.spyOn(messageService, 'getProjectName').mockReturnValue(
        of({
          projectName: 'projectName',
          user: { username: 'username' },
          isModerator: false,
          isAdmin: false,
        }),
      );
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(component.projectName()).toEqual('projectName');
      expect(component.isAdmin()).toEqual(false);
      expect(component.isModerator()).toEqual(false);
      expect(component.username()).toEqual('username');
    });
    it('Should succes moderator', () => {
      jest.spyOn(messageService, 'getProjectName').mockReturnValue(
        of({
          projectName: 'projectName',
          user: { username: 'username' },
          isModerator: true,
          isAdmin: false,
        }),
      );
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(component.projectName()).toEqual('projectName');
      expect(component.isAdmin()).toEqual(false);
      expect(component.isModerator()).toEqual(true);
      expect(component.username()).toEqual('username');
    });
    it('Should succes admin', () => {
      jest.spyOn(messageService, 'getProjectName').mockReturnValue(
        of({
          projectName: 'projectName',
          user: { username: 'username' },
          isModerator: false,
          isAdmin: true,
        }),
      );
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(component.projectName()).toEqual('projectName');
      expect(component.isAdmin()).toEqual(true);
      expect(component.isModerator()).toEqual(false);
      expect(component.username()).toEqual('username');
    });
    it('Should fail, Unauhtorized (401), navigate to auth page', () => {
      jest
        .spyOn(messageService, 'getProjectName')
        .mockReturnValue(
          throwError(() => ({ message: 'Unauthorized', status: 401 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, project not found (404), navigate to home page', () => {
      jest
        .spyOn(messageService, 'getProjectName')
        .mockReturnValue(
          throwError(() => ({ message: 'project not found', status: 404 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, not a member of project (403), navigate to home page', () => {
      jest
        .spyOn(messageService, 'getProjectName')
        .mockReturnValue(
          throwError(() => ({ message: 'not a member', status: 403 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getProjectName(projectId);
      expect(messageService.getProjectName).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('submit Delete Message', () => {
    it('Should call endpoint deleteMessage from messageService', () => {
      jest.spyOn(messageService, 'deleteMessage').mockReturnValue(of());
      component.submitDeleteMessage('messageId');
      expect(messageService.deleteMessage).toHaveBeenCalled();
    });
  });
  describe('deleteMessage', () => {
    const messageId = 'messageId';
    it('Should message deleted', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.submitDeleteMessage(messageId);
      expect(messageService.deleteMessage).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail, unauthorized (401), navigate to page auth', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(
          throwError(() => ({ message: 'unauthorized', status: 401 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitDeleteMessage(messageId);
      expect(messageService.deleteMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, not author of message (403), navigate to page home', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(
          throwError(() => ({ message: 'Not author of message', status: 403 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitDeleteMessage(messageId);
      expect(messageService.deleteMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, message not found (404), navigate to page home', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(
          throwError(() => ({ message: 'Message not found', status: 404 })),
        );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitDeleteMessage(messageId);
      expect(messageService.deleteMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('Open Dialogue Delete All Message', () => {
    it('Should close dialog without data', () => {
      jest.spyOn(component.dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of()),
      } as unknown as MatDialogRef<dialogDeleteMessageComponent>);
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).not.toHaveBeenCalled();
    });
    it('Should close dialog and call deleteAllMessage', () => {
      jest.spyOn(component.dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<dialogDeleteMessageComponent>);
      jest.spyOn(messageService, 'deleteAllMessage').mockReturnValue(of());
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).toHaveBeenCalled();
    });
  });
  describe('delete All Message', () => {
    const dialogMock = () =>
      jest.spyOn(component.dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<dialogDeleteMessageComponent>);
    it('Should succes', () => {
      dialogMock();
      jest
        .spyOn(messageService, 'deleteAllMessage')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail, unauthorized (401), navigate to auth page', () => {
      dialogMock();
      jest.spyOn(messageService, 'deleteAllMessage').mockReturnValue(
        throwError(() => ({
          status: 401,
          error: { message: 'Unauthorized' },
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, not found project (404), navigate to home page', () => {
      dialogMock();
      jest.spyOn(messageService, 'deleteAllMessage').mockReturnValue(
        throwError(() => ({
          status: 404,
          error: { message: 'project not found' },
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, not moderator (403), navigate to home page', () => {
      dialogMock();
      jest.spyOn(messageService, 'deleteAllMessage').mockReturnValue(
        throwError(() => ({
          status: 403,
          error: { message: 'not moderator' },
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogueDeleteAllMessage();
      expect(messageService.deleteAllMessage).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
