import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMoreMessageComponent } from './more-message';
import { MatDialogRef } from '@angular/material/dialog';
import { dialogDeleteMessageComponent } from '../../modal/message/delete-message/delete-message';
import { of } from 'rxjs';

describe('IconMoreMessageComponent', () => {
  let component: IconMoreMessageComponent;
  let fixture: ComponentFixture<IconMoreMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMoreMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMoreMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Emit function', () => {
    fixture.componentRef.setInput('message', {
      message: '',
      isAllMessage: true,
    });
    jest.spyOn(component.submitDelete, 'emit').mockReturnValue();
    jest.spyOn(component.dialog, 'open').mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
    } as unknown as MatDialogRef<dialogDeleteMessageComponent>);
    component.openDialogDeleteMessage();
    expect(component.submitDelete.emit).toHaveBeenCalled();
  });
});
