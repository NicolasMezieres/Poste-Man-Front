import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logo404 } from './logo404';

describe('Logo404', () => {
  let component: Logo404;
  let fixture: ComponentFixture<Logo404>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo404]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Logo404);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
