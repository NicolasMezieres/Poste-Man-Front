import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmation } from './confirmation';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('Confirmation', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
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
      expect(component['dialogRef'].close).toHaveBeenCalledWith();
    });
  });
});
