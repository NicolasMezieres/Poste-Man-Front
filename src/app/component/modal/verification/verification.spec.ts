import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verification } from './verification';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../create-post/mock/dialog.mock';

describe('Verification', () => {
  let component: Verification;
  let fixture: ComponentFixture<Verification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verification],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Verification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
