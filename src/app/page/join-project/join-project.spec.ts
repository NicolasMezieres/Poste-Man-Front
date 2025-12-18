import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinProjectComponent } from './join-project';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { HomeComponent } from '../home/home';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from 'src/app/component/icon/menu/mock/project.service.mock';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast';

describe('JoinProjectComponent', () => {
  let component: JoinProjectComponent;
  let fixture: ComponentFixture<JoinProjectComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let projectService: ProjectService;
  let toast: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinProjectComponent],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
        { provide: ProjectService, useValue: projectServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinProjectComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    projectService = TestBed.inject(ProjectService);
    toast = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function ng On Init', () => {
    it('Missing param linkId redirect to page home', () => {
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should success, redirect to page project', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('linkId');
      jest
        .spyOn(projectService, 'joinProject')
        .mockReturnValue(of({ message: 'message', projectId: 'projectId' }));
      jest.spyOn(toast, 'openSuccesToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openSuccesToast).toHaveBeenCalledWith('message');
      expect(router.navigate).toHaveBeenCalledWith(['/project/projectId']);
    });
    it('Should fail unauhtorized (401), redirect to page auth', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('linkId');
      jest.spyOn(projectService, 'joinProject').mockReturnValue(
        throwError(() => ({
          status: 401,
          error: { message: 'unauthorized' },
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail link not found (404), redirect to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('linkId');
      jest.spyOn(projectService, 'joinProject').mockReturnValue(
        throwError(() => ({
          status: 404,
          error: { message: 'link not found' },
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail already on the project (403), redirect to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('linkId');
      jest.spyOn(projectService, 'joinProject').mockReturnValue(
        throwError(() => ({
          status: 403,
          error: { message: 'Already on the project' },
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
