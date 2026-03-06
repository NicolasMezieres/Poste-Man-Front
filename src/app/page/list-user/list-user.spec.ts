import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserPage } from './list-user';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user/user';
import { userServiceMock } from '../profil/mock/user.service.mock';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { of, throwError } from 'rxjs';

describe('ListUserPage', () => {
  let component: ListUserPage;
  let fixture: ComponentFixture<ListUserPage>;
  let userService: UserService;
  let router: Router;
  let toastService: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUserPage],
      providers: [
        provideHttpClient(),
        { provide: UserService, useValue: userServiceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUserPage);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('NG On Init', () => {
    it('Should init', () => {
      jest.spyOn(component, 'searchUser').mockReturnValue();
      component.ngOnInit();
      expect(component.searchUser).toHaveBeenCalled();
    });
  });
  describe('Toogle filter', () => {
    it('Show filter', () => {
      component.isOpenFilter.set(false);
      component.toggleFilter();
      expect(component.isOpenFilter()).toEqual(true);
    });
    it('Hidde filter', () => {
      component.isOpenFilter.set(true);
      component.toggleFilter();
      expect(component.isOpenFilter()).toEqual(false);
    });
  });
  describe('Search User', () => {
    it('Should succes', () => {
      jest
        .spyOn(userService, 'searchUser')
        .mockReturnValue(of({ data: [], isNextPage: false, totalUser: 0 }));
      component.searchUser();
      expect(userService.searchUser).toHaveBeenCalled();
      expect(component.isOpenFilter()).toEqual(false);
      expect(component.listUser()).toEqual([]);
      expect(component.isNextPage()).toEqual(false);
      expect(component.totalUser()).toEqual(0);
    });
    it('Should fail, cookie expired (401), navigate to page auth', () => {
      jest.spyOn(userService, 'searchUser').mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );
      jest.spyOn(toastService, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.searchUser();
      expect(userService.searchUser).toHaveBeenCalled();
      expect(toastService.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
  describe('Submit Search User', () => {
    it('Should set pagination 1 and use function searchUser', () => {
      jest.spyOn(component, 'searchUser').mockReturnValue();
      component.page.set(2);
      component.submitSearchUser();
      expect(component.page()).toEqual(1);
      expect(component.searchUser).toHaveBeenCalled();
    });
  });
  describe('Change Page', () => {
    it('Should next page', () => {
      component.page.set(1);
      jest.spyOn(component, 'searchUser').mockReturnValue();
      component.changePage(true);
      expect(component.page()).toEqual(2);
      expect(component.searchUser).toHaveBeenCalled();
    });
    it('Should previous page', () => {
      component.page.set(2);
      jest.spyOn(component, 'searchUser').mockReturnValue();
      component.changePage(false);
      expect(component.page()).toEqual(1);
      expect(component.searchUser).toHaveBeenCalled();
    });
  });
});
