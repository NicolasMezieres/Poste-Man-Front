import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertPostComponent } from './transfert-post';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SectionService } from 'src/app/services/section/section';
import { sectionServiceMock } from 'src/app/page/section/mock/section-service.mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';
import { postMock } from '../mock/post-mock';
import { of, throwError } from 'rxjs';

describe('TransfertPostComponent', () => {
  let component: TransfertPostComponent;
  let fixture: ComponentFixture<TransfertPostComponent>;
  let toast: ToastService;
  let router: Router;
  let sectionService: SectionService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertPostComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: SectionService, useValue: sectionServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfertPostComponent);
    component = fixture.componentInstance;
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    sectionService = TestBed.inject(SectionService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close Dialog', () => {
    it('Should close Dialog', () => {
      jest.spyOn(component['dialog'], 'close');
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalled();
    });
  });
  describe('submit Transfer Post', () => {
    it('Should nothing form invalid', () => {
      component.formMovePost.setValue({ sectionId: '' });
      component.submitTransfertPost();
      expect(component['dialog'].close).not.toHaveBeenCalled();
    });
    it('Should dialog close with data', () => {
      component.formMovePost.setValue({ sectionId: 'sectionId' });
      component.submitTransfertPost();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        isSubmit: true,
        sectionId: 'sectionId',
      });
    });
  });
  describe('ng On Init', () => {
    it('Should projectId missing, navigate to page home and close dialog', () => {
      component.data.projectId = '';
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
      expect(sectionService.getSections).not.toHaveBeenCalled();
    });
    it('Should sectionId missing, navigate to page home and close dialog', () => {
      component.data.projectId = 'projectId';
      component.data.sectionId = '';
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
      expect(sectionService.getSections).not.toHaveBeenCalled();
    });
    it('Should  missing, navigate to page home and close dialog', () => {
      component.data.projectId = 'projectId';
      component.data.sectionId = 'sectionId';
      component.data.isAllPost = false;
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      jest.spyOn(component, 'closeDialog');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
      expect(sectionService.getSections).not.toHaveBeenCalled();
    });
    const dataMock = () => {
      component.data.projectId = 'projectId';
      component.data.sectionId = 'sectionId';
      component.data.isAllPost = false;
      component.data.post = postMock;
    };
    it('Should success get Sections', () => {
      dataMock();
      const sectionMock = [
        {
          id: 'sectionId',
          name: 'name',
          isArchive: false,
          projectId: 'projectId',
        },
      ];
      jest.spyOn(sectionService, 'getSections').mockReturnValue(
        of({
          data: sectionMock,
          projectName: 'name',
          isModerator: false,
          isAdmin: false,
        }),
      );
      component.ngOnInit();
      expect(component.sections()).toEqual(sectionMock);
      expect(component.formMovePost.getRawValue()).toEqual({
        sectionId: sectionMock[0].id,
      });
    });
    it('Should fail unauthorized (401), navigate to page auth', () => {
      dataMock();
      jest
        .spyOn(sectionService, 'getSections')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(sectionService.getSections).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, post already in the section (403), navigate to page home', () => {
      dataMock();
      jest
        .spyOn(sectionService, 'getSections')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(sectionService.getSections).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, section not found (404), navigate to page home', () => {
      dataMock();
      jest
        .spyOn(sectionService, 'getSections')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(sectionService.getSections).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
});
