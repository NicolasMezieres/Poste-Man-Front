import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionnComponent } from './form-section';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../create-post/mock/dialog.mock';

describe('FormSectionnComponent', () => {
  let component: FormSectionnComponent;
  let fixture: ComponentFixture<FormSectionnComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionnComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSectionnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
