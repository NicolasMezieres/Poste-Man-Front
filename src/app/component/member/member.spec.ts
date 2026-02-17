import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Member } from './member';
import { memberMock } from '../modal/list-member/mock/member-mock';

describe('Member', () => {
  let component: Member;
  let fixture: ComponentFixture<Member>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Member],
    }).compileComponents();

    fixture = TestBed.createComponent(Member);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('member', memberMock[0]);
    fixture.componentRef.setInput('isAdmin', false);
    fixture.componentRef.setInput('isModerator', false);
    fixture.componentRef.setInput('type', 'online');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
