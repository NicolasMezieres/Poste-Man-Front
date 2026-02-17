import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanUserDialog } from './ban-user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';

describe('BanUserDialog', () => {
  let component: BanUserDialog;
  let fixture: ComponentFixture<BanUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanUserDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BanUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
