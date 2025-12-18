import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectComponent } from './delete-project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../create-post/mock/dialog.mock';

describe('DeleteProjectComponent', () => {
  let component: DeleteProjectComponent;
  let fixture: ComponentFixture<DeleteProjectComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProjectComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function closeDialog', () => {
    it('Should close dialog without data', () => {
      component.closeDialog();
      expect(component.dialog.close).toHaveBeenCalled();
    });
  });
  describe('Function leave Project', () => {
    it('Should close dialog without data', () => {
      component.leaveProject();
      expect(component.dialog.close).toHaveBeenCalledWith({ isLeave: true });
    });
  });
});
