import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCancelComponent } from './button-cancel';

describe('ButtonCancelComponent', () => {
  let component: ButtonCancelComponent;
  let fixture: ComponentFixture<ButtonCancelComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCancelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonCancelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'button');
    fixture.componentRef.setInput('id', 'buttonId');
    fixture.componentRef.setInput('text', 'text');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function handleClick', () => {
    it('Emit function', () => {
      jest.spyOn(component.action, 'emit').mockReturnValue();
      const clickEvent = new Event('click');
      component.handleClick(clickEvent);
      expect(component.action.emit).toHaveBeenCalled();
    });
  });
});
