import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erreur404 } from './erreur404';

describe('Erreur404', () => {
  let component: Erreur404;
  let fixture: ComponentFixture<Erreur404>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erreur404]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Erreur404);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
