import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletePostComponent } from './delete-post';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('DeletePostComponent', () => {
  let component: DeletePostComponent;
  let fixture: ComponentFixture<DeletePostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePostComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: jest.fn(),
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeletePostComponent);
    component = fixture.componentInstance;
  });

  describe('close Dialog', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialog'], 'close');
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalled();
    });
  });
  describe('submit Delete Post', () => {
    it('Should close dialog with data', () => {
      jest.spyOn(component['dialog'], 'close');
      component.submitDeletePost();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });
  });
});
