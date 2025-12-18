import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDeleteComponent } from './button-delete';

describe('ButtonDeleteComponent', () => {
  let component: ButtonDeleteComponent;
  let fixture: ComponentFixture<ButtonDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonDeleteComponent);
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
