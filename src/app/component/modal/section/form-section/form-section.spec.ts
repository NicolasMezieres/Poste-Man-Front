import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionnComponent } from './form-section';

describe('FormSectionnComponent', () => {
  let component: FormSectionnComponent;
  let fixture: ComponentFixture<FormSectionnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSectionnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
