import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserPage } from './list-user';
import { provideHttpClient } from '@angular/common/http';

describe('ListUserPage', () => {
  let component: ListUserPage;
  let fixture: ComponentFixture<ListUserPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUserPage],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
