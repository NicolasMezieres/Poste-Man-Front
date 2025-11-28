import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProjectMobileComponent } from './header-project-mobile';

describe('HeaderProjectMobileComponent', () => {
  let component: HeaderProjectMobileComponent;
  let fixture: ComponentFixture<HeaderProjectMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderProjectMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderProjectMobileComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'nom du projet');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
