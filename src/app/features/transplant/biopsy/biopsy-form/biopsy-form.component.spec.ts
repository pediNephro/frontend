import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiopsyFormComponent } from './biopsy-form.component';

describe('BiopsyFormComponent', () => {
  let component: BiopsyFormComponent;
  let fixture: ComponentFixture<BiopsyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiopsyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiopsyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
