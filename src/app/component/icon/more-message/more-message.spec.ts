import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMoreMessageComponent } from './more-message';

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
    jest.spyOn(component.action, 'emit').mockReturnValue();
    component.handleClick();
    expect(component.action.emit).toHaveBeenCalled();
  });
});
