import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProjectComponent } from './list-project';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from 'src/app/component/icon/menu/mock/project.service.mock';
import { toastMock } from '../auth/mock/toast.mock';
import { of, throwError } from 'rxjs';

describe('ListProjectComponent', () => {
  let component: ListProjectComponent;
  let fixture: ComponentFixture<ListProjectComponent>;
  let toastService: ToastService;
  let router: Router;
  let projectService: ProjectService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProjectComponent],
      providers: [
        provideHttpClient(),
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProjectComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    projectService = TestBed.inject(ProjectService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('NG On Init', () => {
    it('Should init', () => {
      jest.spyOn(component, 'searchProject').mockReturnValue();
      component.ngOnInit();
      expect(component.searchProject).toHaveBeenCalled();
    });
  });
  describe('Toggle Filter', () => {
    it('Should show filter', () => {
      component.isOpenFilter.set(false);
      component.toggleFilter();
      expect(component.isOpenFilter()).toEqual(true);
    });
    it('Should hide filter', () => {
      component.isOpenFilter.set(true);
      component.toggleFilter();
      expect(component.isOpenFilter()).toEqual(false);
    });
  });
  describe('Submit Search Project', () => {
    it('Should call function searchProject', () => {
      jest.spyOn(component, 'searchProject').mockReturnValue();
      component.page.set(2);
      component.submitSearchProject();
      expect(component.page()).toEqual(1);
      expect(component.searchProject).toHaveBeenCalled();
    });
  });
  describe('Search Project', () => {
    it('Should succes', () => {
      jest
        .spyOn(projectService, 'searchByAdmin')
        .mockReturnValue(of({ data: [], isEndList: true, total: 0 }));
      component.searchProject();
      expect(projectService.searchByAdmin).toHaveBeenCalled();
      expect(component.isOpenFilter()).toEqual(false);
      expect(component.totalProject()).toEqual(0);
      expect(component.isEndList()).toEqual(true);
      expect(component.listProject()).toEqual([]);
    });
    it('Should fail, cookie expired (401), navigate to page auth', () => {
      jest
        .spyOn(projectService, 'searchByAdmin')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.searchProject();
      expect(projectService.searchByAdmin).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('Change Page', () => {
    it('Should next page', () => {
      jest.spyOn(component, 'searchProject').mockReturnValue();
      component.page.set(1);
      component.changePage(true);
      expect(component.page()).toEqual(2);
      expect(component.searchProject).toHaveBeenCalled();
    });
    it('Should previous page', () => {
      jest.spyOn(component, 'searchProject').mockReturnValue();
      component.page.set(2);
      component.changePage(false);
      expect(component.page()).toEqual(1);
      expect(component.searchProject).toHaveBeenCalled();
    });
  });
});
