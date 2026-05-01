import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthChartListComponent } from './growth-chart-list.component';

describe('GrowthChartListComponent', () => {
  let component: GrowthChartListComponent;
  let fixture: ComponentFixture<GrowthChartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrowthChartListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowthChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
