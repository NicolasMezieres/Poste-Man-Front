import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMessageComponent } from './list-message';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';
import { provideHttpClient } from '@angular/common/http';
import { messageServiceMock } from 'src/app/page/tchat/mock/message-service.mock';
import { MessageService } from 'src/app/services/message/message';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { Router } from '@angular/router';
import { messageMock } from 'src/app/services/message/mock/message.mock';

describe('ListMessageComponent', () => {
  let component: ListMessageComponent;
  let fixture: ComponentFixture<ListMessageComponent>;
  let dialog: MatDialogRef<ListMessageComponent>;
  let messageService: MessageService;
  let toastService: ToastService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMessageComponent],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMessageComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject<MatDialogRef<ListMessageComponent>>(
      MatDialogRef<ListMessageComponent>,
    );
    messageService = TestBed.inject(MessageService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('NG On Init', () => {
    it('Should get list message', () => {
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(of());
      component.ngOnInit();
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
    });
  });
  describe('Close Dialog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(dialog.close).toHaveBeenCalled();
    });
  });
  describe('Get List Message', () => {
    it('Should succes', () => {
      jest
        .spyOn(messageService, 'getListMessageByUser')
        .mockReturnValue(of({ data: [], isEndList: true, totalMessage: 0 }));
      component.getListMessage();
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
      expect(component.listMessage()).toEqual([]);
      expect(component.isEndList()).toEqual(true);
      expect(component.totalMessage()).toEqual(0);
    });
    it('Should fail, unauthorized (401), navigate to page auth', () => {
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.getListMessage();
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
      expect(component.closeDialog).toHaveBeenCalled();
    });
    it('Should fail, forbidden (403), navigate to page home', () => {
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(
        throwError(() => ({
          status: 403,
        })),
      );
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.getListMessage();
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(component.closeDialog).toHaveBeenCalled();
    });
    it('Should fail, not found (404), navigate to page home', () => {
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.getListMessage();
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
  describe('Update Post', () => {
    it('Should next page', () => {
      component.page.set(1);
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(of());
      component.updatePage(true);
      expect(component.page()).toEqual(2);
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
    });
    it('Should previous page', () => {
      component.page.set(2);
      jest.spyOn(messageService, 'getListMessageByUser').mockReturnValue(of());
      component.updatePage(false);
      expect(component.page()).toEqual(1);
      expect(messageService.getListMessageByUser).toHaveBeenCalled();
    });
  });
  describe('Delete Message', () => {
    it('Should delete message', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toastService, 'openSuccesToast');
      component.listMessage.set([messageMock]);
      component.totalMessage.set(1);
      component.deleteMessage('messageId');
      expect(messageService.deleteMessage).toHaveBeenCalled();
      expect(component.listMessage()).toEqual([]);
      expect(component.totalMessage()).toEqual(0);
      expect(toastService.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail unauthorized (401), navigate to page auth', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.deleteMessage(messageMock.id);
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
      expect(messageService.deleteMessage).toHaveBeenCalled();
    });
    it('Should fail forbidden (403), navigate to page home', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.deleteMessage(messageMock.id);
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(messageService.deleteMessage).toHaveBeenCalled();
    });
    it('Should fail not found user (404), navigate to page home', () => {
      jest
        .spyOn(messageService, 'deleteMessage')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.deleteMessage(messageMock.id);
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(messageService.deleteMessage).toHaveBeenCalled();
    });
  });
});
