import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { UserService } from 'src/app/services/user/user';
import { userServiceMock } from './mock/user.service.mock';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth-service';
import { dialogChangePasswordComponent } from 'src/app/component/modal/change-password/change-password';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogRemoveAccountComponent } from 'src/app/component/modal/delete-account/delete-account';
import { dialogAvatarEditComponent } from 'src/app/component/modal/avatar-edit/avatar-edit';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let userService: UserService;
  let toast: ToastService;
  let router: Router;
  let dialog: MatDialog;
  const dataForm = {
    firstName: 'truc',
    lastName: 'Bidule',
    username: 'chouette',
    email: 'email@gmail.com',
  };
  const resGetMyAccount = {
    data: {
      ...dataForm,
      icon: 'cat',
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilComponent],
      providers: [
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: UserService, useValue: userServiceMock },
        provideRouter([{ path: 'auth', component: AuthService }]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProfilComponent);
    userService = TestBed.inject(UserService);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    userServiceMock.myAccount.mockReturnValue(of(resGetMyAccount));
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function ng On Init', () => {
    it('Get my account should success', () => {
      userServiceMock.myAccount.mockReturnValue(of(resGetMyAccount));
      component.ngOnInit();
      expect(component.formProfil.disabled).toEqual(true);
      expect(userService.myAccount).toHaveBeenCalled();
      expect(component.formProfil.value).toEqual(dataForm);
      expect(component.username()).toEqual(resGetMyAccount.data.username);
      expect(component.image()).toContain('cat');
    });
    it('Get my account should fail should return page auth', () => {
      userServiceMock.myAccount.mockReturnValue(
        throwError(() => ({
          status: 401,
          error: { message: 'Unauhtorized !' },
        })),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(component.formProfil.disabled).toEqual(true);

      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('Function change Disabled', () => {
    it('Should disable form', () => {
      component.isDisable.update(() => false);
      fixture.detectChanges();
      component.changeDisabled();
      expect(component.formProfil.disabled).toEqual(true);
    });
    it('Should enable form', () => {
      component.isDisable.update(() => true);
      fixture.detectChanges();
      component.changeDisabled();
      expect(component.formProfil.disabled).toEqual(false);
    });
  });
  describe('Function submit Form Profil', () => {
    it('form profil invalid', () => {
      component.formProfil.patchValue({ firstName: '' });
      fixture.detectChanges();
      component.submitFormProfil();
      expect(component.isSubmit()).toEqual(true);
      expect(userService.updateMyAccount).not.toHaveBeenCalled();
    });
    it('form profil valid, success update', () => {
      userServiceMock.updateMyAccount.mockReturnValue(
        of({ message: 'success update' }),
      );
      toastMock.openSuccesToast('success update');
      component.isDisable.update(() => false);
      component.formProfil.enable();
      component.formProfil.setValue(dataForm);
      component.submitFormProfil();
      expect(component.isSubmit()).toEqual(true);
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.isDisable()).toEqual(true);
      expect(component.username()).toEqual(resGetMyAccount.data.username);
    });
    it('form profil valid, fail update Unauthorized return page auth', () => {
      userServiceMock.updateMyAccount.mockReturnValue(
        throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })),
      );
      toastMock.openFailToast('Unauthorized');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.isDisable.update(() => false);
      component.formProfil.enable();
      component.formProfil.setValue(dataForm);
      component.submitFormProfil();
      expect(component.isSubmit()).toEqual(true);
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('form profil valid, fail update email already used', () => {
      userServiceMock.updateMyAccount.mockReturnValue(
        throwError(() => ({
          status: 403,
          error: { message: 'Email already used' },
        })),
      );
      toastMock.openFailToast('Unauthorized');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.isDisable.update(() => false);
      component.formProfil.enable();
      component.formProfil.setValue(dataForm);
      component.submitFormProfil();
      expect(component.isSubmit()).toEqual(true);
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
  describe('openDialogChangePassword', () => {
    it('Should open dialog Change Password', () => {
      jest.spyOn(dialog, 'open');
      component.openDialogChangePassword();
      expect(dialog.open).toHaveBeenCalledWith(dialogChangePasswordComponent);
    });
  });
  describe('open Dialog Remove Account', () => {
    it('Should nothing  dialog not return data', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of()),
      } as unknown as MatDialogRef<DialogRemoveAccountComponent>);
      component.openDialogRemoveAccount();
      expect(userService.deleteAccount).not.toHaveBeenCalled();
    });
    it('Should call endpoint  delete account (user)', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DialogRemoveAccountComponent>);
      jest.spyOn(userService, 'deleteAccount');
      component.openDialogRemoveAccount();
      expect(userService.deleteAccount).toHaveBeenCalled();
    });
  });
  describe('remove Account', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DialogRemoveAccountComponent>);
    it('Should succes, navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteAccount')
        .mockReturnValue(of({ message: 'delete' }));
      jest.spyOn(toast, 'openSuccesToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogRemoveAccount();
      expect(userService.deleteAccount).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail unauthorized (401) navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(userService, 'deleteAccount')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openSuccesToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogRemoveAccount();
      expect(userService.deleteAccount).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('openDialogEditAvatar', () => {
    it('Should nothing not submit', () => {
      jest.spyOn(dialog, 'open');
      jest.spyOn(userService, 'changeAvatar');
      component.openDialogEditAvatar();
      expect(userService.changeAvatar).not.toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(dialogAvatarEditComponent);
    });
    it('Should call endpoint changeAvatar (userService)', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<dialogAvatarEditComponent>);
      jest.spyOn(userService, 'changeAvatar');
      component.openDialogEditAvatar();
      expect(userService.changeAvatar).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(dialogAvatarEditComponent);
    });
  });
  describe('edit Avatar', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, avatarName: 'cat' })),
      } as unknown as MatDialogRef<dialogAvatarEditComponent>);
    it('Should succes, avatar changed', () => {
      dialogMock();
      jest
        .spyOn(userService, 'changeAvatar')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openDialogEditAvatar();
      expect(userService.changeAvatar).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.image()).toContain('cat');
    });
    it('Should fail, unauthorized (401), navigate to auth page', () => {
      dialogMock();
      jest.spyOn(userService, 'changeAvatar').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openDialogEditAvatar();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(userService.changeAvatar).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
});
