import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuMemberComponent } from './menu-member';

describe('MenuMemberComponent', () => {
  let fixture: ComponentFixture<MenuMemberComponent>;
  let component: MenuMemberComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMemberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuMemberComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isBan', false);
    fixture.detectChanges();
  });
  it('Should be defined', () => {
    expect(component).toBeDefined();
  });
});
