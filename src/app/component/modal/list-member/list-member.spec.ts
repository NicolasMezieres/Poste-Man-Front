import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMemberComponent } from './list-member';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { AuthSocketServiceMock } from './mock/auth-socket-service-mock';
import { memberMock } from './mock/member-mock';
import { of, throwError } from 'rxjs';
import { DialogKickUser } from '../group/kick-user/kick-user';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from '../../icon/menu/mock/project.service.mock';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { DialogBanUser } from '../group/ban-user/ban-user';

describe('ListMemberComponent', () => {
  let component: ListMemberComponent;
  let fixture: ComponentFixture<ListMemberComponent>;
  let dialog: MatDialog;
  let authSocket: AuthSocketService;
  let router: Router;
  let projectService: ProjectService;
  let toast: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMemberComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
        { provide: AuthSocketService, useValue: AuthSocketServiceMock },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ToastService, useValue: toastMock },
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMemberComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    authSocket = TestBed.inject(AuthSocketService);
  });
  afterEach(() => jest.clearAllMocks());
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close Dialog', () => {
    it('Should close dialog', () => {
      expect(component['dialogRef'].close);
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
  describe('ng On Init', () => {
    it('Should received memberList', async () => {
      jest
        .spyOn(authSocket, 'connectedListMember')
        .mockResolvedValue(memberMock);
      jest.spyOn(authSocket, 'listenAuth').mockReturnValue(of());
      component.ngOnInit();
      await Promise.resolve();
      expect(component.members()).toEqual(memberMock);
      expect(component.detectChange());
    });
    it('Should error', async () => {
      jest.spyOn(authSocket, 'connectedListMember').mockRejectedValue('');
      jest.spyOn(authSocket, 'listenAuth').mockReturnValue(of());
      jest.spyOn(component, 'closeDialog');
      component.ngOnInit();
      await Promise.resolve().then();
      expect(component.closeDialog).toHaveBeenCalled();
    });
    it('Get List Member when is an Admin', () => {
      jest
        .spyOn(projectService, 'getListMember')
        .mockReturnValue(of({ data: memberMock }));
      component.data.isAdmin = true;
      fixture.detectChanges();
      expect(projectService.getListMember).toHaveBeenCalled();
      expect(component.members()).toEqual(memberMock);
    });
    it('Error when is an Admin', () => {
      jest
        .spyOn(projectService, 'getListMember')
        .mockReturnValue(throwError(() => {}));
      jest.spyOn(component, 'closeDialog').mockReturnValue();
      component.data.isAdmin = true;
      fixture.detectChanges();
      expect(projectService.getListMember).toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
  describe('detectChange', () => {
    it('Should received online', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'online' }));
      component.members.set(memberMock);
      component.detectChange();
      expect(component.members()).toEqual([
        { ...memberMock[0], isConnected: true },
      ]);
    });
    it('Should received offline', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'offline' }));
      component.members.set(memberMock);
      component.detectChange();
      expect(component.members()).toEqual([
        { ...memberMock[0], isConnected: false },
      ]);
    });

    it('Should received userJoinProject', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'userJoinProject' }));
      component.members.set([]);
      component.detectChange();
      expect(component.members()).toEqual(memberMock);
    });
    it('Should received userLeaveProject', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'userLeaveProject' }));
      component.members.set(memberMock);
      component.detectChange();
      expect(component.members()).toEqual([]);
    });
    it('Should received userBanned', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'userBanned' }));
      component.members.set(memberMock);
      component.detectChange();
      expect(component.members()).toEqual([
        { ...memberMock[0], isBanned: true },
      ]);
    });
    it('Should received userUnBanned', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ ...memberMock[0], type: 'userUnBanned' }));
      component.members.set([{ ...memberMock[0], isBanned: true }]);
      component.detectChange();
      expect(component.members()).toEqual([
        {
          ...memberMock[0],
          isBanned: false,
        },
      ]);
    });
    it('Should received banned', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ type: 'banned', ...memberMock[0] }));
      jest.spyOn(authSocket, 'deconnection');
      jest.spyOn(component['dialogRef'], 'close');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.detectChange();
      expect(authSocket.deconnection).toHaveBeenCalled();
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should received kicked', () => {
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ type: 'kicked', ...memberMock[0] }));
      jest.spyOn(component['dialogRef'], 'close');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.detectChange();
      expect(authSocket.deconnection).toHaveBeenCalled();
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('openDialogKickUser', () => {
    it('Should call endpoint kickUser from projectService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: 'true', userId: 'userId' })),
      } as unknown as MatDialogRef<DialogKickUser>);
      jest.spyOn(projectService, 'kickUser').mockReturnValue(of());
      jest.spyOn(toast, 'openSuccesToast');
      component.openDialogKickUser(memberMock[0]);
      expect(dialog.open).toHaveBeenCalledWith(DialogKickUser, {
        data: memberMock[0],
      });
      expect(projectService.kickUser).toHaveBeenCalled();
    });
    it('Should not call endpoint kickUser', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of()),
      } as unknown as MatDialogRef<DialogKickUser>);
      component.openDialogKickUser(memberMock[0]);
      expect(projectService.kickUser).not.toHaveBeenCalled();
    });
  });
  describe('kickUser', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: 'true', userId: 'userId' })),
      } as unknown as MatDialogRef<DialogKickUser>);
    const openDialog = () => component.openDialogKickUser(memberMock[0]);
    it('Should succes', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'kickUser')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      openDialog();
      expect(projectService.kickUser).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail, Unauthorized (401), navigate to page auth', () => {
      dialogMock();
      jest.spyOn(projectService, 'kickUser').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.kickUser).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, user not found (404), navigate to page home', () => {
      dialogMock();
      jest.spyOn(projectService, 'kickUser').mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.kickUser).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, not a moderator (403), navigate to page home', () => {
      dialogMock();
      jest.spyOn(projectService, 'kickUser').mockReturnValue(
        throwError(() => ({
          status: 403,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.kickUser).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('openDialogBanUser', () => {
    it('Should call endpoint ban from projectService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: 'true', userId: 'userId' })),
      } as unknown as MatDialogRef<DialogBanUser>);
      jest.spyOn(projectService, 'ban').mockReturnValue(of());
      jest.spyOn(toast, 'openSuccesToast');
      component.openDialogBanUser(memberMock[0]);
      expect(dialog.open).toHaveBeenCalledWith(DialogBanUser, {
        data: { member: memberMock[0] },
      });
      expect(projectService.ban).toHaveBeenCalled();
    });
    it('Should not call endpoint ban', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of()),
      } as unknown as MatDialogRef<DialogBanUser>);
      component.openDialogBanUser(memberMock[0]);
      expect(dialog.open).toHaveBeenCalledWith(DialogBanUser, {
        data: { member: memberMock[0] },
      });
      expect(projectService.ban).not.toHaveBeenCalled();
    });
  });
  describe('banUser', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: 'true', userId: 'userId' })),
      } as unknown as MatDialogRef<DialogBanUser>);
    const openDialog = () => component.openDialogBanUser(memberMock[0]);
    it('Should succes', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'ban')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      openDialog();
      expect(projectService.ban).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail, not connected (401), navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'ban')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.ban).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, user not found (404), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'ban')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.ban).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, not a moderator (403), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'ban')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      openDialog();
      expect(projectService.ban).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
