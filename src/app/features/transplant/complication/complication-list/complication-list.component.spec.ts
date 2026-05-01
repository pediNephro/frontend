import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplicationListComponent } from './complication-list.component';

describe('ComplicationListComponent', () => {
  let component: ComplicationListComponent;
  let fixture: ComponentFixture<ComplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplicationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});