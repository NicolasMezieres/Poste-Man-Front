import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { dialogMock } from '../../modal/create-post/mock/dialog.mock';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from './mock/project.service.mock';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

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
      jest
        .spyOn(projectService, 'search')
        .mockReturnValue(
          of({ data: [{ id: 'id', name: 'name' }], total: 1, isEndList: true }),
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
});
