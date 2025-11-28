import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHelpComponent } from './help';

describe('IconHelpComponent', () => {
  let component: IconHelpComponent;
  let fixture: ComponentFixture<IconHelpComponent>;
  let view: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHelpComponent);
    component = fixture.componentInstance;
    view = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('Emit function', () => {
    jest.spyOn(component.actionHelp, 'emit').mockReturnValue();
    const buttonHelp = view.querySelector('button');
    if (!buttonHelp) {
      throw new Error();
    }
    buttonHelp.click();
    expect(component.actionHelp.emit).toHaveBeenCalled();
  });
});
