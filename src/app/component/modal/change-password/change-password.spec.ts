import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dialogChangePasswordComponent } from './change-password';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('dialogChangePasswordComponent', () => {
  let component: dialogChangePasswordComponent;
  let fixture: ComponentFixture<dialogChangePasswordComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dialogChangePasswordComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(dialogChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close', () => {
    it('Should close dialog', () => {
      jest.spyOn(dialogMock, 'close');
      component.close();
      expect(dialogMock.close).toHaveBeenCalled();
    });
  });
  describe('submit Change Password', () => {});
});
