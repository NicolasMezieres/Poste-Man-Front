import { ComponentFixture, TestBed } from '@angular/core/testing';
import { dialogDeleteMessageComponent } from './delete-message';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('dialog Delete Message Component', () => {
  let fixture: ComponentFixture<dialogDeleteMessageComponent>;
  let component: dialogDeleteMessageComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dialogDeleteMessageComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(dialogDeleteMessageComponent);
    component = fixture.componentInstance;
  });
  it('Should be defined', () => {
    expect(component).toBeDefined();
  });
  describe('closeDialog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(component.dialog.close).toHaveBeenCalled();
    });
  });
  describe('submit Delete Message', () => {
    it('Should close dialog with data', () => {
      component.submitDeleteMessage();
      expect(component.dialog.close).toHaveBeenCalledWith({ isSubmit: true });
    });
  });
});
