import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertPost } from './transfert-post';

describe('TransfertPost', () => {
  let component: TransfertPost;
  let fixture: ComponentFixture<TransfertPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfertPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
