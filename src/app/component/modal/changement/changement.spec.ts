import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Changement } from './changement';

describe('Changement', () => {
  let component: Changement;
  let fixture: ComponentFixture<Changement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Changement],
    }).compileComponents();

    fixture = TestBed.createComponent(Changement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
