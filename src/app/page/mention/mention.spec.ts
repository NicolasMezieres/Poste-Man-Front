import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mention } from './mention';

describe('Mention', () => {
  let component: Mention;
  let fixture: ComponentFixture<Mention>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mention]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mention);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
