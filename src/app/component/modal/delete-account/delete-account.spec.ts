import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveAccountComponent } from './delete-account';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('DialogRemoveAccountComponent', () => {
  let component: DialogRemoveAccountComponent;
  let fixture: ComponentFixture<DialogRemoveAccountComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRemoveAccountComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(DialogRemoveAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component.close();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
  describe('Submit Remove Account', () => {
    it('Should close dialog with data', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component.submitRemoveAccount();
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });
  });
});
