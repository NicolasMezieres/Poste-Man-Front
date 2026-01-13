import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dialogAvatarEditComponent } from './avatar-edit';
import { dialogMock } from '../dialogMock/dialog-mock';
import { MatDialogRef } from '@angular/material/dialog';

describe('dialogAvatarEditComponent', () => {
  let component: dialogAvatarEditComponent;
  let fixture: ComponentFixture<dialogAvatarEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dialogAvatarEditComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(dialogAvatarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
