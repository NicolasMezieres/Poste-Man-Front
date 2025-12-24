import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../modal/dialogMock/dialog-mock';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
