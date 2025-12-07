import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionComponent } from './section';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { SectionService } from 'src/app/services/section/section';
import { sectionServiceMock } from './mock/section-service.mock';
import { HomeComponent } from '../home/home';
import { of, throwError } from 'rxjs';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let toast: ToastService;
  let sectionService: SectionService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionComponent],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: SectionService, useValue: sectionServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    toast = TestBed.inject(ToastService);
    sectionService = TestBed.inject(SectionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function ng On Init', () => {
    it('Should fail, no params, navigate to page home', () => {
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should success Get sections of project', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      jest.spyOn(sectionService, 'getSections').mockReturnValue(
        of({
          data: [
            {
              id: 'sectionId',
              name: 'nom de la section',
              isArchive: false,
              projectId: 'projectId',
            },
          ],
          isModerator: false,
          isAdmin: false,
        }),
      );
      component.ngOnInit();
      expect(sectionService.getSections).toHaveBeenCalledWith('projectId');
      expect(component.sections()).toEqual([
        {
          id: 'sectionId',
          name: 'nom de la section',
          isArchive: false,
          projectId: 'projectId',
        },
      ]);
      expect(component.isModerator()).toBe(false);
      expect(component.isAdmin()).toBe(false);
    });
    it('Should fail unauhtorized, navigate to page auth', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      jest.spyOn(sectionService, 'getSections').mockReturnValue(
        throwError(() => ({
          status: 401,
          error: {
            message: 'unauthorized',
          },
        })),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not found, navigate to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      jest.spyOn(sectionService, 'getSections').mockReturnValue(
        throwError(() => ({
          status: 404,
          error: {
            message: 'not found project',
          },
        })),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail forbidden, navigate to page home', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('projectId');
      jest.spyOn(sectionService, 'getSections').mockReturnValue(
        throwError(() => ({
          status: 403,
          error: {
            message: 'forbidden',
          },
        })),
      );
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
