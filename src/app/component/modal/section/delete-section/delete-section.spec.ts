import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSectionComponent } from './delete-section';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../create-post/mock/dialog.mock';

describe('DeleteSectionComponent', () => {
  let component: DeleteSectionComponent;
  let fixture: ComponentFixture<DeleteSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSectionComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('close Diaog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalledWith();
    });
  });
  describe('delete Section', () => {
    it('Should close dialog with data', () => {
      component.deleteSection();
      expect(component['dialog'].close).toHaveBeenCalledWith({
        isSubmit: true,
      });
    });
  });
});
