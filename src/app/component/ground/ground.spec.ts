import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundComponent } from './ground';

describe('GroundComponent', () => {
  let component: GroundComponent;
  let fixture: ComponentFixture<GroundComponent>;
  let view: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroundComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('zoom', 1);
    view = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function init Page', () => {
    it('Should  isMovable to be false', () => {
      component.isMovable.update(() => true);
      component.initPage();
      const dragEvent = new Event('dragend');
      document.dispatchEvent(dragEvent);
      expect(component.isMovable()).toBe(false);
    });
    it('Should disable scroll of the window', () => {
      component.initPage();
      const wheelEvent = new WheelEvent('wheel', { ctrlKey: true });
      jest.spyOn(wheelEvent, 'preventDefault').mockReturnValue();
      window.dispatchEvent(wheelEvent);
      expect(wheelEvent.preventDefault).toHaveBeenCalled();
    });
  });
  describe('Function detect Zoom', () => {
    it('Should zoom', () => {
      const wheelEvent = new WheelEvent('wheel', { ctrlKey: true, deltaY: 1 });
      jest.spyOn(wheelEvent, 'preventDefault');
      jest.spyOn(component, 'updateZooming').mockReturnValue();
      const main = view.querySelector('#ground');
      component.initPage();
      component.detectZoom();
      main?.dispatchEvent(wheelEvent);
      expect(component.updateZooming).toHaveBeenCalledWith(wheelEvent);
    });
    it('Should not zoom', () => {
      const table = view.querySelector('#table');
      jest.spyOn(component, 'updateZooming');
      table?.remove();
      fixture.detectChanges();
      component.detectZoom();
      expect(component.updateZooming).not.toHaveBeenCalled();
    });
  });
  describe('Function toggle Move', () => {
    it('Should is Movable true', () => {
      const eventPoint = { type: 'pointerdown' } as PointerEvent;
      component.toggleMove(true, eventPoint);
      expect(component.isMovable()).toEqual(true);
    });
    it('Should is Movable false', () => {
      const eventPoint = { type: 'pointerup' } as PointerEvent;
      component.toggleMove(false, eventPoint);
      expect(component.isMovable()).toEqual(false);
    });
    it('Should preserve old position of cursor ', () => {
      const eventPoint = {
        type: 'pointerup',
        clientX: 1,
        clientY: 1,
      } as PointerEvent;
      component.toggleMove(true, eventPoint);
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      expect(component.cursorX()).toEqual(1);
      expect(component.cursorY()).toEqual(1);
      expect(component.previousCursorX()).toEqual(0);
      expect(component.previousCursorY()).toEqual(0);
    });
  });
  describe('Function move', () => {
    it('should nothing , is movable false', () => {
      component.isMovable.update(() => false);
      const mouseEvent = new MouseEvent('pointermove');
      component.move(mouseEvent);
    });
    it('Should move a card', () => {
      component.isMovable.update(() => true);
      const mouseEvent = new MouseEvent('pointermove');
      component.move(mouseEvent);
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      expect(component.originX()).toEqual(0);
      expect(component.originY()).toEqual(0);
    });
    it('Should not found table', () => {
      component.isMovable.update(() => true);
      const mouseEvent = new MouseEvent('pointermove');
      const table = view.querySelector('#table');
      table?.remove();
      fixture.detectChanges();
      component.move(mouseEvent);
    });
  });
  describe('Function update Zooming', () => {
    it('Should not found table', () => {
      const table = view.querySelector('#table');
      table?.remove();
      fixture.detectChanges();
      const wheelEvent = { type: 'wheel' } as WheelEvent;
      component.updateZooming(wheelEvent);
    });
    it('Should update zoom less (0.9 to 1) ', () => {
      const wheelEvent = new WheelEvent('wheel', { deltaY: -10 });
      component.zoom.update(() => 0.9);
      component.updateZooming(wheelEvent);
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      expect(component.zoom()).toEqual(1);
    });
    it('Should update zoom more (1 to 0.9) ', () => {
      const wheelEvent = new WheelEvent('wheel', { deltaY: 10 });
      component.zoom.update(() => 1);
      const ground = view.querySelector('#ground') as HTMLElement;
      jest.spyOn(ground, 'getBoundingClientRect').mockReturnValue({
        width: -1000,
        height: -1000,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      });
      component.updateZooming(wheelEvent);
      jest.useFakeTimers();
      jest.advanceTimersByTime(100);
      expect(component.zoom()).toEqual(0.9);
    });
  });
});
