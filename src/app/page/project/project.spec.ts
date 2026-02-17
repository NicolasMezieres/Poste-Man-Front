import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from 'src/app/component/icon/menu/mock/project.service.mock';
import { HomeComponent } from '../home/home';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteProjectComponent } from 'src/app/component/modal/project/delete-project/delete-project';
import { EditProjectComponent } from 'src/app/component/modal/project/edit/edit';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let projectService: ProjectService;
  let toast: ToastService;
  let dialog: MatDialog;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectComponent],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: ProjectService, useValue: projectServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  describe('ng On Init', () => {
    it('Should init Page', () => {
      jest.spyOn(router.events, 'subscribe');
      jest.spyOn(component, 'initPage').mockReturnValue();
      component.ngOnInit();
      expect(component.initPage).toHaveBeenCalled();
    });
  });
  describe('initPage', () => {
    it('Missing params projectId, redirect to page home', () => {
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.initPage();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should success Get Project data', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');

      jest
        .spyOn(projectService, 'getProject')
        .mockReturnValue(
          of({ projectName: 'name', isAdmin: false, isModerator: false }),
        );
      component.initPage();
      expect(component.projectId()).toBe('projectId');
      expect(component.projectName()).toBe('name');
      expect(component.isAdmin()).toBe(false);
      expect(component.isModerator()).toBe(false);
    });
    it('Should fail Get Project, unauthorized (401)', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');

      jest.spyOn(projectService, 'getProject').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.initPage();
      expect(component.projectId()).toBe('projectId');
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail Get Project, not found project (404)', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');

      jest.spyOn(projectService, 'getProject').mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.initPage();
      expect(component.projectId()).toBe('projectId');
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail Get Project, You are not in the project (403)', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');

      jest.spyOn(projectService, 'getProject').mockReturnValue(
        throwError(() => ({
          status: 403,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.initPage();
      expect(component.projectId()).toBe('projectId');
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('toggle Visible', () => {
    it('Should be Visible', () => {
      component.isVisible.set(false);
      component.toggleVisbile();
      expect(component.isVisible()).toBe(true);
    });
    it('Should be Invisible', () => {
      component.isVisible.set(true);
      component.toggleVisbile();
      expect(component.isVisible()).toBe(false);
    });
  });
  describe('open Modal leave', () => {
    it('Should leave project, member', () => {
      component.isAdmin.set(false);
      component.isModerator.set(false);
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      component.openModalLeave();
      jest.spyOn(projectService, 'remove');
      expect(dialog.open).toHaveBeenCalledWith(DeleteProjectComponent, {
        data: { isDelete: false, projectName: component.projectName() },
      });
      expect(projectService.remove).toHaveBeenCalled();
    });
    it('Should delete project, moderator', () => {
      component.isAdmin.set(false);
      component.isModerator.set(true);
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(projectService, 'remove');
      component.openModalLeave();
      expect(dialog.open).toHaveBeenCalledWith(DeleteProjectComponent, {
        data: { isDelete: true, projectName: component.projectName() },
      });
      expect(projectService.remove).toHaveBeenCalled();
    });
    it('Should delete project, moderator', () => {
      component.isAdmin.set(true);
      component.isModerator.set(false);
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(projectService, 'remove');
      component.openModalLeave();
      expect(dialog.open).toHaveBeenCalledWith(DeleteProjectComponent, {
        data: { isDelete: true, projectName: component.projectName() },
      });
      expect(projectService.remove).toHaveBeenCalled();
    });
  });
  describe('leave', () => {
    it('Should success leave project', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      component.projectId.set('projectId');
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalLeave();
      expect(projectService.remove).toHaveBeenCalledWith(component.projectId());
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail unauthorized (401)', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      component.projectId.set('projectId');
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalLeave();
      expect(projectService.remove).toHaveBeenCalledWith(component.projectId());
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not found (404)', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      component.projectId.set('projectId');
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalLeave();
      expect(projectService.remove).toHaveBeenCalledWith(component.projectId());
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail not a member (403)', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<unknown>);
      component.projectId.set('projectId');
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalLeave();
      expect(projectService.remove).toHaveBeenCalledWith(component.projectId());
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('edit', () => {
    it('Should edit project', () => {
      const newName = 'new name';
      component.projectId.set('projectId');
      component.projectName.set('name');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, name: newName })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(projectService, 'rename');
      component.edit();
      expect(dialog.open).toHaveBeenCalledWith(EditProjectComponent, {
        data: {
          name: component.projectName(),
          projectId: component.projectId(),
        },
      });
      expect(projectService.rename).toHaveBeenCalledWith(
        component.projectId(),
        { name: newName },
      );
    });
  });
  describe('rename Project', () => {
    it('Should success rename project', () => {
      const newName = 'new name';
      component.projectId.set('projectId');
      component.projectName.set('name');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, name: newName })),
      } as unknown as MatDialogRef<unknown>);
      jest
        .spyOn(projectService, 'rename')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.edit();
      expect(projectService.rename).toHaveBeenCalledWith(
        component.projectId(),
        { name: newName },
      );
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.projectName()).toBe(newName);
    });
    it('Should fail redirect to page auth, unauthorized (401) ', () => {
      const newName = 'new name';
      component.projectId.set('projectId');
      component.projectName.set('name');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, name: newName })),
      } as unknown as MatDialogRef<unknown>);
      jest
        .spyOn(projectService, 'rename')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.edit();
      expect(projectService.rename).toHaveBeenCalledWith(
        component.projectId(),
        { name: newName },
      );
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail redirect to page home, not found project (404) ', () => {
      const newName = 'new name';
      component.projectId.set('projectId');
      component.projectName.set('name');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, name: newName })),
      } as unknown as MatDialogRef<unknown>);
      jest
        .spyOn(projectService, 'rename')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.edit();
      expect(projectService.rename).toHaveBeenCalledWith(
        component.projectId(),
        { name: newName },
      );
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail redirect to page home, not a moderator (403)', () => {
      const newName = 'new name';
      component.projectId.set('projectId');
      component.projectName.set('name');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, name: newName })),
      } as unknown as MatDialogRef<unknown>);
      jest
        .spyOn(projectService, 'rename')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.edit();
      expect(projectService.rename).toHaveBeenCalledWith(
        component.projectId(),
        { name: newName },
      );
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Invvitation', () => {
    it('Should success create invitation', () => {
      jest.spyOn(projectService, 'createInvitationLink').mockReturnValue(
        of({
          data: { id: 'linkId', outdatedAt: new Date() },
          message: 'test',
        }),
      );
      jest.spyOn(dialog, 'open');
      component.openInvitation();
      expect(projectService.createInvitationLink).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();
    });
    it('Should fail  redirect to page auth, unauthorized (401)', () => {
      jest
        .spyOn(projectService, 'createInvitationLink')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(dialog, 'open');
      component.openInvitation();
      expect(projectService.createInvitationLink).toHaveBeenCalled();
      expect(dialog.open).not.toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail  redirect to page home, not a moderator (403)', () => {
      jest
        .spyOn(projectService, 'createInvitationLink')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(dialog, 'open');
      component.openInvitation();
      expect(projectService.createInvitationLink).toHaveBeenCalled();
      expect(dialog.open).not.toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail  redirect to page home, not found (404)', () => {
      jest
        .spyOn(projectService, 'createInvitationLink')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(dialog, 'open');
      component.openInvitation();
      expect(projectService.createInvitationLink).toHaveBeenCalled();
      expect(dialog.open).not.toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
