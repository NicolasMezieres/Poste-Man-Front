import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBackComponent } from './back';

describe('IconBackComponent', () => {
  let component: IconBackComponent;
  let fixture: ComponentFixture<IconBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
