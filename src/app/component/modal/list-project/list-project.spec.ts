import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProjectComponent } from './list-project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from '../../icon/menu/mock/project.service.mock';
import { of, throwError } from 'rxjs';

describe('ListProjectComponent', () => {
  let component: ListProjectComponent;
  let fixture: ComponentFixture<ListProjectComponent>;
  let dialog: MatDialogRef<ListProjectComponent>;
  let toastService: ToastService;
  let router: Router;
  let projectService: ProjectService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProjectComponent],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
        { provide: ToastService, useValue: toastMock },
        { provide: ProjectService, useValue: projectServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ListProjectComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject<MatDialogRef<ListProjectComponent>>(
      MatDialogRef<ListProjectComponent>,
    );
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);
    projectService = TestBed.inject(ProjectService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Close Dialog', () => {
    it('Should close dialog', () => {
      jest.spyOn(dialog, 'close');
      component.closeDialog();
      expect(dialog.close).toHaveBeenCalled();
    });
  });
  describe('Navigate To Project', () => {
    it('Should navigate to page project', () => {
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(dialog, 'close');
      component.navigateToProject('projectId');
      expect(router.navigate).toHaveBeenCalledWith([
        `/detailProject/projectId`,
      ]);
      expect(dialog.close).toHaveBeenCalled();
    });
  });
  describe('Get List Project', () => {
    it('Should succes', () => {
      jest
        .spyOn(projectService, 'getListProjectByUser')
        .mockReturnValue(of({ data: [], isEndList: true, totalProject: 0 }));
      component.getListProject();
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(component.isEndList()).toEqual(true);
      expect(component.totalProject()).toEqual(0);
    });
    it('Should fail unauthorized (401), navigate to page auth', () => {
      jest
        .spyOn(projectService, 'getListProjectByUser')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getListProject();
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail forbidden (403), navigate to page home', () => {
      jest
        .spyOn(projectService, 'getListProjectByUser')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getListProject();
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail not found (404), navigate to page home', () => {
      jest
        .spyOn(projectService, 'getListProjectByUser')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.getListProject();
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('Update Page', () => {
    it('Should next page', () => {
      jest.spyOn(projectService, 'getListProjectByUser').mockReturnValue(of());
      component.page.set(1);
      component.updatePage(true);
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(component.page()).toEqual(2);
    });
    it('Should previous page', () => {
      jest.spyOn(projectService, 'getListProjectByUser').mockReturnValue(of());
      component.page.set(2);
      component.updatePage(false);
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
      expect(component.page()).toEqual(1);
    });
  });
  describe('NG On Init', () => {
    it('Should init', () => {
      jest.spyOn(projectService, 'getListProjectByUser').mockReturnValue(of());
      component.ngOnInit();
      expect(projectService.getListProjectByUser).toHaveBeenCalled();
    });
  });
});
