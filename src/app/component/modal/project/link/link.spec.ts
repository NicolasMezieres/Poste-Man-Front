import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from '../../dialogMock/dialog-mock';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: jest.fn() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function Close Dialog', () => {
    it('Should close dialog', () => {
      component.closeDialog();
      expect(component['dialog'].close).toHaveBeenCalled();
    });
  });
  describe('Function copy Link', () => {
    it('Should copy link', () => {
      jest.spyOn(component['clipboard'], 'copy');
      component.copyLink();
      expect(component['clipboard'].copy).toHaveBeenCalled();
      expect(component.isCopied()).toBe(true);
    });
  });
});
