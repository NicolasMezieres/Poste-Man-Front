import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('close', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component.close();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
  describe('submitCreate', () => {
    it('Should nothing formPost invalid', () => {
      component.formPost.setValue({ text: '' });
      component.submitCreate();
      expect(component['dialogRef'].close).not.toHaveBeenCalled();
    });
    it('Should close dialog with data', () => {
      component.formPost.setValue({ text: 'text' });
      jest.spyOn(component['dialogRef'], 'close');
      component.submitCreate();
      const data = component.formPost.getRawValue();
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        isSubmit: true,
        ...data,
      });
    });
  });
});
