import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjectPage } from './detail-project';

describe('DetailProjectPage', () => {
  let component: DetailProjectPage;
  let fixture: ComponentFixture<DetailProjectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjectPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
