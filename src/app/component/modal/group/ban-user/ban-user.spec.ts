import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogBanUser } from './ban-user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';
import { memberMock } from '../../list-member/mock/member-mock';

describe('DialogBanUser', () => {
  let component: DialogBanUser;
  let fixture: ComponentFixture<DialogBanUser>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBanUser],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { member: memberMock[0] },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DialogBanUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('Should be define', () => {
    expect(component).toBeDefined();
  });
  describe('ngOnInit', () => {
    it('Should delay for confirm ', () => {
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
  describe('submitBanUser', () => {
    it('Should close dialog with data', () => {
      jest.spyOn(component['dialog'], 'close');
      component.submitBanUser();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });
  });
});
