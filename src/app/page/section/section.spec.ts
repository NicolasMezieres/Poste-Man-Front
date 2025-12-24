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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormSectionComponent } from 'src/app/component/modal/section/create-section/form-section';
import { DeleteSectionComponent } from 'src/app/component/modal/section/delete-section/delete-section';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let toast: ToastService;
  let sectionService: SectionService;
  let dialog: MatDialog;
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
    dialog = TestBed.inject(MatDialog);
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
          projectName: 'name',
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
      expect(component.projectName()).toBe('name');
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
  describe('toggle Visible', () => {
    it('Should false => true', () => {
      component.isVisible.set(false);
      component.toggleVisible();
      expect(component.isVisible()).toBe(true);
    });
    it('Should true => false', () => {
      component.isVisible.set(true);
      component.toggleVisible();
      expect(component.isVisible()).toBe(false);
    });
  });
  describe('open modal create section', () => {
    it('Should call http createSection of section Service', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ name: 'name' })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(sectionService, 'createSection').mockReturnValue(of());
      component.openModalCreateSection();
      expect(dialog.open).toHaveBeenCalledWith(FormSectionComponent);
      expect(sectionService.createSection).toHaveBeenCalledWith(
        { name: 'name' },
        component.projectId(),
      );
    });
  });
  describe('Create Section', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ name: 'name' })),
      } as unknown as MatDialogRef<unknown>);
    };
    it('Should success create Section', () => {
      const dataSection = {
        id: 'id',
        name: 'name',
        isArchive: false,
        projectId: component.projectId(),
      };
      dialogMock();
      jest.spyOn(sectionService, 'createSection').mockReturnValue(
        of({
          message: 'message',
          data: dataSection,
        }),
      );
      jest.spyOn(toast, 'openSuccesToast').mockReturnValue();
      component.openModalCreateSection();
      expect(sectionService.createSection).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.sections()).toEqual([dataSection]);
    });
    it('Should fail create Section, unauthorized (401)', () => {
      dialogMock();
      jest.spyOn(sectionService, 'createSection').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreateSection();
      expect(sectionService.createSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not found project (404)', () => {
      dialogMock();
      jest.spyOn(sectionService, 'createSection').mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreateSection();
      expect(sectionService.createSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail not a moderator (403)', () => {
      dialogMock();
      jest.spyOn(sectionService, 'createSection').mockReturnValue(
        throwError(() => ({
          status: 403,
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreateSection();
      expect(sectionService.createSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Modal Edit Section', () => {
    it('Should call endpoint update Section from sectionService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ name: 'name' })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(sectionService, 'updateSection');
      component.openModalEditSection('otherName', 'sectionId');
      expect(dialog.open).toHaveBeenCalledWith(FormSectionComponent, {
        data: { name: 'otherName' },
      });
      expect(sectionService.updateSection).toHaveBeenCalled();
    });
  });
  describe('edit Section', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ name: 'name' })),
      } as unknown as MatDialogRef<unknown>);
    };
    it('Should succes', () => {
      const dataSection = {
        id: 'id',
        projectId: component.projectId(),
        name: 'name',
        isArchive: false,
      };
      dialogMock();
      jest.spyOn(sectionService, 'updateSection').mockReturnValue(
        of({
          message: 'succes',
          data: dataSection,
        }),
      );
      component.sections.set([{ ...dataSection, name: 'otherName' }]);
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalEditSection('name', 'id');
      expect(sectionService.updateSection).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.sections()).toEqual([dataSection]);
    });
    it('Should fail? unauthorized (401)', () => {
      dialogMock();
      jest.spyOn(sectionService, 'updateSection').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalEditSection('name', 'id');
      expect(sectionService.updateSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, not found (404)', () => {
      dialogMock();
      jest.spyOn(sectionService, 'updateSection').mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalEditSection('name', 'id');
      expect(sectionService.updateSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it("Should fail, you're not moderator (403)", () => {
      dialogMock();
      jest.spyOn(sectionService, 'updateSection').mockReturnValue(
        throwError(() => ({
          status: 403,
        })),
      );
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalEditSection('name', 'id');
      expect(sectionService.updateSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Modal Delete Section', () => {
    it('Should call endpoint remove Section from section Service', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<unknown>);
      jest.spyOn(sectionService, 'removeSection');
      component.openModalDeleteSection('sectionId', 'sectionName');
      expect(sectionService.removeSection).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(DeleteSectionComponent, {
        data: { title: 'sectionName', isAllSection: false },
      });
    });
  });
  describe('delete Section', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<unknown>);
    };
    it('Should success section deleted', () => {
      dialogMock();
      component.sections.set([
        {
          id: 'sectionId',
          name: 'sectionName',
          projectId: component.projectId(),
          isArchive: false,
        },
      ]);
      jest
        .spyOn(sectionService, 'removeSection')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalDeleteSection('sectionId', 'sectionName');
      expect(sectionService.removeSection).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.sections()).toEqual([]);
    });
    it('Should fail, unauthorized (401)', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeSection')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteSection('sectionId', 'sectionName');
      expect(sectionService.removeSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, not found section (404)', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeSection')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteSection('sectionId', 'sectionName');
      expect(sectionService.removeSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, not a moderator (403)', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeSection')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteSection('sectionId', 'sectionName');
      expect(sectionService.removeSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Modal Remove All Section', () => {
    it('Should call endpoint removeAllSection from section Service', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeleteSectionComponent>);
      jest.spyOn(sectionService, 'removeAllSection');
      component.openModalRemoveAllSection();
      expect(sectionService.removeAllSection).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(DeleteSectionComponent, {
        data: { title: component.projectName(), isAllSection: true },
      });
    });
  });
  describe('remove All Section', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeleteSectionComponent>);
    };
    it('Should success, All Section Deleted', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeAllSection')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalRemoveAllSection();
      expect(sectionService.removeAllSection).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.sections()).toEqual([]);
    });
    it('Should fail redirect to page auth , unauthorized (401)', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeAllSection')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalRemoveAllSection();
      expect(sectionService.removeAllSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail redirect to page home, project not found (404)', () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeAllSection')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalRemoveAllSection();
      expect(sectionService.removeAllSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it("Should fail redirect to page home, you're not a moderator (403)", () => {
      dialogMock();
      jest
        .spyOn(sectionService, 'removeAllSection')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalRemoveAllSection();
      expect(sectionService.removeAllSection).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
