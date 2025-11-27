import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tchat } from './tchat';

describe('Tchat', () => {
  let component: Tchat;
  let fixture: ComponentFixture<Tchat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tchat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tchat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
