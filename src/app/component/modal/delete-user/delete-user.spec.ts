import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserDialog } from './delete-user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('DeleteUserDialog', () => {
  let component: DeleteUserDialog;
  let fixture: ComponentFixture<DeleteUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Close Dialog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(component.dialog.close).toHaveBeenCalledWith();
    });
  });
  describe('Submit Delete User', () => {
    it('Should close dialog with data', () => {
      component.submitDeleteUser();
      expect(component.dialog.close).toHaveBeenCalledWith({ isSubmit: true });
    });
  });
});
