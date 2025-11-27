import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonActionComponent } from './button-action';

describe('ButtonActionComponent', () => {
  let component: ButtonActionComponent;
  let fixture: ComponentFixture<ButtonActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonActionComponent);
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
