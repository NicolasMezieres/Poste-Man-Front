import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailUserPage } from './detail-user';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { UserService } from 'src/app/services/user/user';
import { userServiceMock } from '../profil/mock/user.service.mock';
import { of, throwError } from 'rxjs';
import { ListProjectComponent } from 'src/app/component/modal/list-project/list-project';
import { ListMessageComponent } from 'src/app/component/modal/list-message/list-message';
import { BanUserDialog } from 'src/app/component/modal/ban-user/ban-user';
import { DeleteUserDialog } from 'src/app/component/modal/delete-user/delete-user';

describe('DetailUserPage', () => {
  let component: DetailUserPage;
  let fixture: ComponentFixture<DetailUserPage>;
  let dialog: MatDialog;
  let router: Router;
  let route: ActivatedRoute;
  let userService: UserService;
  let toastService: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUserPage],
      providers: [
        provideHttpClient(),
        { provide: ToastService, toastMock },
        { provide: UserService, useValue: userServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailUserPage);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    userService = TestBed.inject(UserService);
    toastService = TestBed.inject(ToastService);
  });
  const userMock = {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    isActive: true,
    gdpr: true,
    username: 'username',
    createdAt: '05/03/2026',
    updatedAt: '05/03/2026',
  };
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('NG On Init', () => {
    it('Should init page detailUser', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('userId');
      jest.spyOn(userService, 'getUser').mockReturnValue(
        of({
          data: userMock,
        }),
      );
      component.ngOnInit();
      expect(component.userId()).toEqual('userId');
      expect(userService.getUser).toHaveBeenCalled();
      expect(component.detailUser()).toEqual(userMock);
    });
    it('Params not found, navigate to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(userService.getUser).not.toHaveBeenCalled();
    });
  });
  describe('Open Modal List Project', () => {
    it('Should open modal list project', () => {
      jest.spyOn(dialog, 'open');
      component.openModalListProject();
      expect(dialog.open).toHaveBeenCalledWith(
        ListProjectComponent,
        expect.objectContaining({
          data: {
            userId: component.userId(),
            username: component.detailUser()?.username,
          },
        }),
      );
    });
  });
  describe('Open Modal List Message', () => {
    it('Should open modal list message', () => {
      jest.spyOn(dialog, 'open');
      component.openModalListMessage();
      expect(dialog.open).toHaveBeenCalledWith(
        ListMessageComponent,
        expect.objectContaining({
          data: {
            userId: component.userId(),
            username: component.detailUser()?.username,
          },
        }),
      );
    });
  });
  describe('Open Modal Ban User', () => {
    it('Should open modal ban user', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<BanUserDialog>);
      jest.spyOn(userService, 'banUser');
      component.openModalBanUser();
      expect(dialog.open).toHaveBeenCalledWith(
        BanUserDialog,
        expect.objectContaining({
          data: {
            username: component.detailUser()?.username,
            isActive: component.detailUser()?.isActive,
          },
        }),
      );
      expect(userService.banUser).toHaveBeenCalled();
    });
  });
  describe('Ban User', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<BanUserDialog>);
    };
    it('Should user banned', () => {
      dialogMock();
      jest
        .spyOn(userService, 'banUser')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toastService, 'openSuccesToast');
      component.detailUser.set(userMock);
      component.openModalBanUser();

      expect(userService.banUser).toHaveBeenCalled();
      expect(toastService.openSuccesToast).toHaveBeenCalled();
      expect(component.detailUser()).toEqual({
        ...userMock,
        isActive: !userMock.isActive,
      });
    });
    it('Should fail, cookie expired (401), navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(userService, 'banUser')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalBanUser();
      expect(userService.banUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, forbidden (403), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(userService, 'banUser')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalBanUser();
      expect(userService.banUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, user not found (404), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(userService, 'banUser')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalBanUser();
      expect(userService.banUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('Open Modal Delete User', () => {
    it('Should submit delete user', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeleteUserDialog>);
      jest.spyOn(userService, 'deleteUser').mockReturnValue(of());
      component.openModalDeleteUser();
      expect(dialog.open).toHaveBeenCalledWith(DeleteUserDialog, {
        data: { username: component.detailUser()?.username },
      });
      expect(userService.deleteUser).toHaveBeenCalled();
    });
  });
  describe('Delete User', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeleteUserDialog>);
    it('Should user deleted', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteUser')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toastService, 'openSuccesToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteUser();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(toastService.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, cookie expired (401), navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteUser')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteUser();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, forbidden (403), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteUser')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteUser();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, user not found (404), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteUser')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toastService, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteUser();
      expect(userService.deleteUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
