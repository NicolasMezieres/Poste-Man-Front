import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaveprojet } from './leaveprojet';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('Leaveprojet', () => {
  let component: Leaveprojet;
  let fixture: ComponentFixture<Leaveprojet>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaveprojet],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Leaveprojet);
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
});
