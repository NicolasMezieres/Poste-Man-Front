import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjectPage } from './detail-project';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { HomeComponent } from '../home/home';
import { ProjectService } from 'src/app/services/project/project';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast';
import { projectServiceMock } from 'src/app/component/icon/menu/mock/project.service.mock';
import { toastMock } from '../auth/mock/toast.mock';
import { of, throwError } from 'rxjs';
import { ListMemberComponent } from 'src/app/component/modal/list-member/list-member';
import { DeleteProjectComponent } from 'src/app/component/modal/project/delete-project/delete-project';

describe('DetailProjectPage', () => {
  let component: DetailProjectPage;
  let fixture: ComponentFixture<DetailProjectPage>;
  let projectService: ProjectService;
  let router: Router;
  let route: ActivatedRoute;
  let dialog: MatDialog;
  let toast: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjectPage],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'home', component: HomeComponent }]),
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProjectPage);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
    toast = TestBed.inject(ToastService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const projectMock = {
    author: 'author',
    totalPost: 0,
    totalSection: 0,
    updatedAt: '05/03/2026',
    createdAt: '05/03/2026',
    projectName: 'projectName',
  };
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('NG On Init', () => {
    it('Should get detail project', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      jest.spyOn(projectService, 'getDetail').mockReturnValue(
        of({
          data: projectMock,
        }),
      );
      component.ngOnInit();
      expect(component.projectId()).toEqual('projectId');
      expect(projectService.getDetail).toHaveBeenCalled();
      expect(component.detailData()).toEqual(projectMock);
    });
    it('Params not found, navigate to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(projectService.getDetail).not.toHaveBeenCalled();
    });
  });
  describe('Open Modal List Member', () => {
    it('Open Modal List Member', () => {
      jest.spyOn(dialog, 'open');
      component.openModalListMember();
      expect(dialog.open).toHaveBeenCalledWith(
        ListMemberComponent,
        expect.objectContaining({
          data: {
            projectId: component.projectId(),
            isModerator: false,
            isAdmin: true,
          },
        }),
      );
    });
  });
  describe('Open Modal Delete Project', () => {
    it('Should submit endpoint project delete', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<DeleteProjectComponent>);
      jest.spyOn(projectService, 'remove').mockReturnValue(of());
      component.openModalDeleteProject();
      expect(dialog.open).toHaveBeenCalledWith(DeleteProjectComponent, {
        data: {
          isDelete: true,
          projectName: component.detailData()?.projectName,
        },
      });
      expect(projectService.remove).toHaveBeenCalled();
    });
  });
  describe('Project Delete', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isLeave: true })),
      } as unknown as MatDialogRef<DeleteProjectComponent>);
    it('Should succes, project deleted', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteProject();
      expect(projectService.remove).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, cookie expired (401), navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteProject();
      expect(projectService.remove).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, forbidden (403), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteProject();
      expect(projectService.remove).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, project not found (404), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(projectService, 'remove')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteProject();
      expect(projectService.remove).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
