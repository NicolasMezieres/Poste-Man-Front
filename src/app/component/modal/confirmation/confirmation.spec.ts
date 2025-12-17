import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmation } from './confirmation';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../create-post/mock/dialog.mock';

describe('Confirmation', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
