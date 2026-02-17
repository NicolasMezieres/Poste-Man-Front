import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPostComponent } from './post';
import { postMock } from '../../modal/post/mock/post-mock';

describe('CardPostComponent', () => {
  let component: CardPostComponent;
  let fixture: ComponentFixture<CardPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPostComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', postMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
