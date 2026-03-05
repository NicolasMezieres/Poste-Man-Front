import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanUserDialog } from './ban-user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('BanUserDialog', () => {
  let component: BanUserDialog;
  let fixture: ComponentFixture<BanUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanUserDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BanUserDialog);
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
  describe('Submit Ban', () => {
    it('Should close dialog with data', () => {
      component.submitBan();
      expect(component.dialog.close).toHaveBeenCalledWith({ isSubmit: true });
    });
  });
});
