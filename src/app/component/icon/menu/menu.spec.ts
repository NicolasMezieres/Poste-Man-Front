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

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let projectService: ProjectService;
  let toast: ToastService;
  let router: Router;
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('updateSearch', () => {
    it('Should reset pagination', () => {
      jest.useFakeTimers();
      jest.spyOn(projectService, 'search').mockReturnValue(of());
      jest.spyOn(component, 'debounceSearch').mockReturnValue('test');
      fixture.detectChanges();
      component.page.update(() => 2);
      component.search.update(() => 'test');
      jest.advanceTimersByTime(500);
      expect(component.page()).toBe(1);
    });
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
});
