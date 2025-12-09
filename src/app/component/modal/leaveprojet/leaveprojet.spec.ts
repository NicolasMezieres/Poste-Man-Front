import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaveprojet } from './leaveprojet';

describe('Leaveprojet', () => {
  let component: Leaveprojet;
  let fixture: ComponentFixture<Leaveprojet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaveprojet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leaveprojet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
