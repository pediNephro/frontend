import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthChartFormComponent } from './growth-chart-form.component';

describe('GrowthChartFormComponent', () => {
  let component: GrowthChartFormComponent;
  let fixture: ComponentFixture<GrowthChartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrowthChartFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowthChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
