import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFormComponent } from './input-form';
import { FormControl } from '@angular/forms';

describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('inputId', 'inputId');
    fixture.componentRef.setInput('label', 'label');
    fixture.componentRef.setInput('type', 'type');
    fixture.componentRef.setInput('placeholder', 'placeholder');
    fixture.componentRef.setInput('control', new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function updateValue', () => {
    it('Should emit value update', () => {
      jest.spyOn(component.value, 'emit').mockReturnValue();
      component.updateValue('data');
      expect(component.value.emit).toHaveBeenCalled();
    });
  });
});
