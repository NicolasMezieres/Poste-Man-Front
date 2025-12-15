import { Component, model, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-ground',
  imports: [],
  templateUrl: './ground.html',
  styleUrl: './ground.css',
})
export class GroundComponent implements OnInit {
  zoom = model.required<number>();
  originX = signal<number>(0);
  originY = signal<number>(0);
  isMovable = signal<boolean>(false);
  cursorX = signal<number>(0);
  cursorY = signal<number>(0);
  previousCursorX = signal<number>(0);
  previousCursorY = signal<number>(0);

  initPage() {
    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
    document.addEventListener('dragend', () => {
      this.isMovable.update(() => false);
    });
  }
  detectZoom() {
    const ground = document.getElementById('ground');
    const table = document.getElementById('table');
    if (!table || !ground) return;
    ground.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        if (e.deltaY) {
          this.updateZooming(e);
        }
      }
    });
  }
  updateZooming(e: WheelEvent) {
    const ground = document.getElementById('ground');
    const table = document.getElementById('table');
    if (!ground || !table) return;
    const boundingGround = ground.getBoundingClientRect();
    const boundingTable = table.getBoundingClientRect();
    const cursorX = e.clientX - boundingGround.x;
    const posX = cursorX - this.originX();
    const cursorY = e.clientY - boundingGround.y;
    const posY = cursorY - this.originY();
    const oldZoom = this.zoom();
    const viewportWidth = boundingGround.width;
    const viewportHeight = boundingGround.height;
    if (e.deltaY > 0) {
      console.log(viewportWidth, viewportHeight);
      if (
        viewportWidth - (boundingTable.width / oldZoom) * (this.zoom() - 0.1) <
          0 &&
        viewportHeight -
          (boundingTable.height / oldZoom) * (this.zoom() - 0.1) <
          0
      ) {
        this.zoom.update((old) => Number((old - 0.1).toFixed(1)));
      }
    } else if (e.deltaY < 0 && this.zoom() < 1) {
      this.zoom.update((old) => Number((old + 0.1).toFixed(1)));
    }
    const newOriginX = (posX / oldZoom) * this.zoom();
    const newPosX = cursorX - newOriginX;
    const newOriginY = (posY / oldZoom) * this.zoom();
    const newPosY = cursorY - newOriginY;

    const totalWidth = (boundingTable.width / oldZoom) * this.zoom();
    const totalHeight = (boundingTable.height / oldZoom) * this.zoom();
    const minX = viewportWidth - totalWidth;
    const minY = viewportHeight - totalHeight;
    const newX = Math.min(0, Math.max(minX, newPosX));
    const newY = Math.min(0, Math.max(minY, newPosY));
    this.originX.update(() => newX);
    this.originY.update(() => newY);
  }
  toggleMove(value: boolean, e: PointerEvent) {
    this.cursorX.update(() => e.clientX);
    this.cursorY.update(() => e.clientY);
    this.isMovable.update(() => value);
    this.previousCursorX.update(() => this.originX());
    this.previousCursorY.update(() => this.originY());
  }
  move(e: MouseEvent) {
    if (this.isMovable()) {
      const posX = e.clientX - this.cursorX() + this.previousCursorX();
      const posY = e.clientY - this.cursorY() + this.previousCursorY();
      const ground = document.querySelector('#ground');
      const table = document.getElementById('table');
      if (!ground || !table) return;
      const boundingGround = ground.getBoundingClientRect();
      const boundingTable = table.getBoundingClientRect();
      const viewportWidth = boundingGround.width;
      const viewportHeight = boundingGround.height;
      const totalWidth = boundingTable.width;
      const totalHeight = boundingTable.height;
      const minX = viewportWidth - totalWidth;
      const minY = viewportHeight - totalHeight;
      this.originX.update(() => Math.min(0, Math.max(minX, posX)));
      this.originY.update(() => Math.min(0, Math.max(minY, posY)));
    }
  }
  ngOnInit(): void {
    this.initPage();
    this.detectZoom();
  }
}
