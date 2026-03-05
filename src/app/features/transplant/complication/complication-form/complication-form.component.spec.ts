import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplicationFormComponent } from './complication-form.component';

describe('ComplicationFormComponent', () => {
  let component: ComplicationFormComponent;
  let fixture: ComponentFixture<ComplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});