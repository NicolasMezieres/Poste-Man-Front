import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';
import { AuthSocketService } from './services/auth/auth-socket';
import { UserService } from './services/user/user';
import { AuthSocketServiceMock } from './component/modal/list-member/mock/auth-socket-service-mock';
import { userServiceMock } from './page/profil/mock/user.service.mock';
import { HomeComponent } from './page/home/home';
import { AuthService } from './services/auth/auth-service';
import { authServiceMock } from './page/auth/mock/auth-service.mock';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let router: Router;
  let authSocket: AuthSocketService;
  let userService: UserService;
  let subscription: Subscription;
  let authService: AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: Subscription, useValue: { unsubscribe: jest.fn() } },
        { provide: AuthSocketService, useValue: AuthSocketServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([{ path: 'home', component: HomeComponent }]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    authSocket = TestBed.inject(AuthSocketService);
    userService = TestBed.inject(UserService);
    subscription = TestBed.inject(Subscription);
    authService = TestBed.inject(AuthService);
  });
  afterEach(() => jest.clearAllMocks());
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
  describe('ngOnInit', () => {
    const userServiceSpyon = () => {
      jest
        .spyOn(authService, 'log')
        .mockReturnValue(of({ message: '', isAdmin: false }));
      jest.spyOn(authService, 'getIsAdmin').mockReturnValue(false);
      jest.spyOn(authSocket, 'authSocket').mockReturnValue();
    };
    const deconnection = () => {
      jest.spyOn(authSocket, 'deconnection');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
    };
    const expectReceiveSocketData = () => {
      expect(authSocket.authSocket).toHaveBeenCalled();
      expect(authSocket.listenAuth).toHaveBeenCalled();
      expect(authSocket.deconnection).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    };
    it('Should user connect and listen authSocket', () => {
      userServiceSpyon();
      jest.spyOn(authSocket, 'listenAuth').mockReturnValue(of());
      app.ngOnInit();
      expect(authService.getIsAdmin).toHaveBeenCalled();
      expect(authSocket.authSocket).toHaveBeenCalled();
      expect(authSocket.listenAuth).toHaveBeenCalled();
    });
    it('Should received banned, navigate to page home', () => {
      userServiceSpyon();
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ type: 'banned', userId: 'userId' }));
      deconnection();
      app.ngOnInit();
      expectReceiveSocketData();
    });
    it('Should received kicked, navigate to page home', () => {
      userServiceSpyon();
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ type: 'kicked', userId: 'userId' }));
      deconnection();
      app.ngOnInit();
      expectReceiveSocketData();
    });
    it('Should not connect, navigate to page auth', () => {
      jest
        .spyOn(authService, 'log')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      app.ngOnInit();
      expect(authSocket.authSocket).not.toHaveBeenCalled();
      expect(authSocket.listenAuth).not.toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('Should nothing not subscription', () => {
      app.ngOnDestroy();
      expect(subscription.unsubscribe).not.toHaveBeenCalled();
    });
    it('Should unsubscribe', () => {
      jest.spyOn(userService, 'myAccount').mockReturnValue(of());
      jest.spyOn(userService.myAccount(), 'subscribe');
      jest.spyOn(authSocket, 'authSocket');
      jest
        .spyOn(authSocket, 'listenAuth')
        .mockReturnValue(of({ type: 'other', userId: 'userId' }));
      jest.spyOn(authSocket.listenAuth(), 'subscribe');
      app.ngOnInit();
      setTimeout(() => {
        app.ngOnDestroy();
        expect(subscription.unsubscribe).toHaveBeenCalled();
      }, 0);
    });
  });
});
