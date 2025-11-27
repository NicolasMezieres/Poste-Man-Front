import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TchatComponent } from './tchat';

describe('TchatComponent', () => {
  let component: TchatComponent;
  let fixture: ComponentFixture<TchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TchatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
