import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../modal/dialogMock/dialog-mock';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('username', 'username');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('close', () => {
    it('Should close dialog', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component.close();
      expect(component['dialogRef'].close).toHaveBeenCalledWith();
    });
  });
});
