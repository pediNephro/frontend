import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplicationDetailComponent } from './complication-detail.component';

describe('ComplicationDetailComponent', () => {
  let component: ComplicationDetailComponent;
  let fixture: ComponentFixture<ComplicationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplicationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});