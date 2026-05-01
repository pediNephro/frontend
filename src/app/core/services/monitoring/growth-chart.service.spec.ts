import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GrowthChartService } from './growth-chart.service';

describe('GrowthChartService', () => {
  let service: GrowthChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GrowthChartService]
    });
    service = TestBed.inject(GrowthChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
