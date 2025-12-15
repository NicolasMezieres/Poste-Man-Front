import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertConfirmation } from './transfert-confirmation';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../create-post/mock/dialog.mock';

describe('TransfertConfirmation', () => {
  let component: TransfertConfirmation;
  let fixture: ComponentFixture<TransfertConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertConfirmation],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfertConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
