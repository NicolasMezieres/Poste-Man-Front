import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMessageComponent } from './list-message';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../dialogMock/dialog-mock';
import { provideHttpClient } from '@angular/common/http';

describe('ListMessageComponent', () => {
  let component: ListMessageComponent;
  let fixture: ComponentFixture<ListMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMessageComponent],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
