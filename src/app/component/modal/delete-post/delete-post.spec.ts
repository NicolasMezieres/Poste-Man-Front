import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePost } from './delete-post';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../create-post/mock/dialog.mock';

describe('DeletePost', () => {
  let component: DeletePost;
  let fixture: ComponentFixture<DeletePost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePost],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
