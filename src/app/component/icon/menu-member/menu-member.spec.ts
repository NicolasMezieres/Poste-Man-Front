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
    fixture.detectChanges();
  });
});
