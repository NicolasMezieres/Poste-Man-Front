import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserDialog } from './delete-user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('DeleteUserDialog', () => {
  let component: DeleteUserDialog;
  let fixture: ComponentFixture<DeleteUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
