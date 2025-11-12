import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidAccountComponent } from './valid-account';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('ValidAccountComponent', () => {
  let component: ValidAccountComponent;
  let fixture: ComponentFixture<ValidAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidAccountComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidAccountComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
