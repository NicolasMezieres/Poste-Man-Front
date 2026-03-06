import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth-service';
import { authServiceMock } from '../auth/mock/auth-service.mock';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('NG On Init', () => {
    it('Should set isAdmin', () => {
      jest
        .spyOn(authService, 'log')
        .mockReturnValue(of({ isAdmin: true, message: 'connected' }));
      component.ngOnInit();
      expect(authService.log).toHaveBeenCalled();
      expect(component.isAdmin()).toEqual(true);
    });
  });
});
