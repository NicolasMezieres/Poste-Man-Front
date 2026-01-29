import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUserPage } from './detail-user';

describe('DetailUserPage', () => {
  let component: DetailUserPage;
  let fixture: ComponentFixture<DetailUserPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUserPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
