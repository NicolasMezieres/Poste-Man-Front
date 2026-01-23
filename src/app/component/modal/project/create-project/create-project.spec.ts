import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProject } from './create-project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from 'src/app/component/icon/menu/mock/project.service.mock';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { Router } from '@angular/router';

describe('CreateProject', () => {
  let component: CreateProject;
  let fixture: ComponentFixture<CreateProject>;
  let projectService: ProjectService;
  let toast: ToastService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProject],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: { closeModal: jest.fn() } },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ToastService, useValue: toastMock },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProject);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('submitFromCreate', () => {
    it('Should nothing form is invalid', () => {
      jest.spyOn(projectService, 'create');
      component.formCreateProject.setValue({ name: '' });
      component.submitFromCreate();
      expect(projectService.create).not.toHaveBeenCalled();
      expect(component.isSubmit()).toEqual(true);
    });
    it('Should succes create project', () => {
      component.formCreateProject.setValue({ name: 'name' });
      jest
        .spyOn(projectService, 'create')
        .mockReturnValue(
          of({ message: 'succes', data: { projectId: 'projectId' } }),
        );
      jest.spyOn(toast, 'openSuccesToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'close');
      jest.spyOn(component['dataModal'], 'closeModal');
      component.submitFromCreate();
      expect(projectService.create).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/project/projectId']);
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
      expect(component['dataModal'].closeModal).toHaveBeenCalled();
      expect(component.isSubmit()).toEqual(true);
    });
    it('Should fail, not connected (401), navigate to page auth', () => {
      component.formCreateProject.setValue({ name: 'name' });
      jest
        .spyOn(projectService, 'create')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.submitFromCreate();
      expect(component.isSubmit()).toEqual(true);
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(projectService.create).toHaveBeenCalled();
    });
  });
  describe('close', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component.close();
      expect(component['dialogRef'].close).toHaveBeenCalledWith();
    });
  });
});
