import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogKickUser } from './kick-user';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('DialogKickUser', () => {
  let component: DialogKickUser;
  let fixture: ComponentFixture<DialogKickUser>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogKickUser],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(DialogKickUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('Should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('Should delay for confirm', () => {
      jest.useFakeTimers();
      component.ngOnInit();
      expect(component.isDisable()).toEqual(true);
      expect(component.textDelay()).toEqual('3');
      jest.advanceTimersByTime(1000);
      expect(component.isDisable()).toEqual(true);
      expect(component.textDelay()).toEqual('2');
      jest.advanceTimersByTime(1000);
      expect(component.isDisable()).toEqual(true);
      expect(component.textDelay()).toEqual('1');
      jest.advanceTimersByTime(1000);
      expect(component.textDelay()).toEqual('Confirmer');
      expect(component.isDisable()).toEqual(false);
    });
  });
  describe('closeDialog', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialog'], 'close');
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalledWith();
    });
  });
  describe('submitKickUser', () => {
    it('Should close dialog with data', () => {
      jest.spyOn(component['dialog'], 'close');
      component.submitKickUser();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });
  });
});
