import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from './mock/project.service.mock';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { dialogMock } from '../../modal/dialogMock/dialog-mock';
import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from 'src/app/page/auth/mock/auth-service.mock';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { AuthSocketServiceMock } from '../../modal/list-member/mock/auth-socket-service-mock';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let projectService: ProjectService;
  let toast: ToastService;
  let router: Router;
  let authSocketService: AuthSocketService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthSocketService, useValue: AuthSocketServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    authSocketService = TestBed.inject(AuthSocketService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function close Dialog', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialog'], 'close').mockReturnValue();
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalled();
    });
  });
  describe('Function searchProject', () => {
    it('Should success', () => {
      jest.spyOn(projectService, 'search').mockReturnValue(
        of({
          data: [{ id: 'id', name: 'name' }],
          total: 1,
          isEndList: true,
          user: { username: 'username' },
        }),
      );
      component.searchProject();
      expect(projectService.search).toHaveBeenCalled();
      expect(component.projects()).toEqual([{ id: 'id', name: 'name' }]);
    });
    it('Should fail toast, 401 redirect to page auth', () => {
      jest.spyOn(projectService, 'search').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog').mockReturnValue();
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      component.searchProject();
      expect(projectService.search).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
  describe('submit Logout', () => {
    it('Should call endpoint logout authService', () => {
      jest.spyOn(authServiceMock, 'logout').mockReturnValue(of());
      component.submitLogout();
      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });
  describe('logout', () => {
    it('Should succes, navigate to page auth', () => {
      jest
        .spyOn(authServiceMock, 'logout')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toastMock, 'openSuccesToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitLogout();
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('connectSocket', () => {
    it('Should connect to server (socket) and close dialog', () => {
      jest.spyOn(authSocketService, 'authSocket');
      jest.spyOn(authSocketService, 'connectedListMember');
      jest.spyOn(authSocketService, 'listenAuth').mockReturnValue(of());
      jest.spyOn(component, 'listenAuth');
      jest.spyOn(component['dialog'], 'close');
      component.connectSocket('projectId');
      expect(authSocketService.authSocket).toHaveBeenCalled();
      expect(authSocketService.connectedListMember).toHaveBeenCalledWith(
        'projectId',
      );
      expect(component.listenAuth).toHaveBeenCalled();
      expect(component['dialog'].close).toHaveBeenCalled();
    });
  });
  describe('listenAuth', () => {
    it('Should received banned', () => {
      jest
        .spyOn(authSocketService, 'listenAuth')
        .mockReturnValue(of({ type: 'banned', userId: 'userId' }));
      jest.spyOn(authSocketService, 'deconnection');
      jest.spyOn(component['dialog'], 'close');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.listenAuth();
      expect(authSocketService.deconnection).toHaveBeenCalled();
      expect(component['dialog'].close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should received kicked', () => {
      jest
        .spyOn(authSocketService, 'listenAuth')
        .mockReturnValue(of({ type: 'kicked', userId: 'userId' }));
      jest.spyOn(authSocketService, 'deconnection');
      jest.spyOn(component['dialog'], 'close');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.listenAuth();
      expect(authSocketService.deconnection).toHaveBeenCalled();
      expect(component['dialog'].close).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
