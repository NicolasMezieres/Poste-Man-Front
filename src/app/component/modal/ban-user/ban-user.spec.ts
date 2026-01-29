import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanUserDialog } from './ban-user';

describe('BanUserDialog', () => {
  let component: BanUserDialog;
  let fixture: ComponentFixture<BanUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanUserDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(BanUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
