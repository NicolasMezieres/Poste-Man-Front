import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionComponent } from './form-section';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('FormSectionComponent', () => {
  let component: FormSectionComponent;
  let fixture: ComponentFixture<FormSectionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('close Dialog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalledWith();
    });
  });
  describe('submit', () => {
    it('Should nothing, form invalid', () => {
      component.formSection.setValue({ name: '' });
      component.submit();
      expect(component['dialog'].close).not.toHaveBeenCalled();
    });
    it('Should close dialog with data form', () => {
      component.formSection.setValue({ name: 'name' });
      component.submit();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        name: 'name',
      });
    });
  });
});
