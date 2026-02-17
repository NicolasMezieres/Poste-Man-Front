import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erreur500 } from './erreur500';
import { provideRouter } from '@angular/router';

describe('Erreur500', () => {
  let component: Erreur500;
  let fixture: ComponentFixture<Erreur500>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erreur500],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Erreur500);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
