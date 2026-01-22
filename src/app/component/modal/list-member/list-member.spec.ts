import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ListMemberComponent } from './list-member';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { member, resListenAuthData } from 'src/app/utils/type';
import { AuthSocketServiceMock } from './mock/auth-socket-service-mock';
import { memberMock } from './mock/member-mock';
import { Observable, of } from 'rxjs';

describe('ListMemberComponent', () => {
  let component: ListMemberComponent;
  let fixture: ComponentFixture<ListMemberComponent>;
  let dialog: MatDialog;
  let authSocket: AuthSocketService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMemberComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
        { provide: AuthSocketService, useValue: AuthSocketServiceMock },
        provideRouter([]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMemberComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    authSocket = TestBed.inject(AuthSocketService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close Dialog', () => {
    it('Should close dialog', () => {
      expect(component['dialogRef'].close);
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
  describe('ng On Init', () => {
    it('Should received memberList', async () => {
      jest
        .spyOn(authSocket, 'connectedListMember')
        .mockResolvedValue(memberMock);
      jest.spyOn(authSocket, 'listenAuth').mockReturnValue(of());
      component.ngOnInit();
      await Promise.resolve();
      expect(component.members()).toEqual(memberMock);
      expect(component.detectChange());
    });
    it('Should error', async () => {
      jest.spyOn(authSocket, 'connectedListMember').mockRejectedValue('');
      jest.spyOn(authSocket, 'listenAuth').mockReturnValue(of());
      jest.spyOn(component, 'closeDialog');
      component.ngOnInit();
      await Promise.resolve().then();
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
});
