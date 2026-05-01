import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthChartViewComponent } from './growth-chart-view.component';

describe('GrowthChartViewComponent', () => {
  let component: GrowthChartViewComponent;
  let fixture: ComponentFixture<GrowthChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrowthChartViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowthChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
