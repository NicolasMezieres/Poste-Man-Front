import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectComponent } from './edit';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('EditProjectComponent', () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProjectComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Function Close Dialog', () => {
    it('Should close dialog', () => {
      jest.spyOn(component.dialog, 'close');
      component.closeDialog();
      expect(component.dialog.close).toHaveBeenCalled();
    });
  });
  describe('Function Submit Form Edit', () => {
    it('Should nothing form not valid', () => {
      component.formEditProject.setValue({ name: '' });
      jest.spyOn(component.dialog, 'close');
      component.submitFormEdit();
      expect(component.dialog.close).not.toHaveBeenCalled();
    });
    it('Should dialog close with data', () => {
      jest.spyOn(component.dialog, 'close');
      component.formEditProject.setValue({ name: 'project' });
      component.submitFormEdit();
      expect(component.dialog.close).toHaveBeenCalledWith({
        name: 'project',
        isSubmit: true,
      });
    });
  });
});
