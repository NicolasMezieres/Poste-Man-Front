import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePost } from './delete-post';

describe('DeletePost', () => {
  let component: DeletePost;
  let fixture: ComponentFixture<DeletePost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
