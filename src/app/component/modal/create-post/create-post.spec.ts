import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePost } from './create-post';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from './mock/dialog.mock';

describe('CreatePost', () => {
  let component: CreatePost;
  let fixture: ComponentFixture<CreatePost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePost],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
