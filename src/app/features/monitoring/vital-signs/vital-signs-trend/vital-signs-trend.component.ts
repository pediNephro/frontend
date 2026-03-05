import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip, ApexGrid } from 'ng-apexcharts';
import { VitalSignService } from '../../../../core/services/monitoring/vital-sign.service';
import { VitalSign } from '../../../../core/models/monitoring';

@Component({
  selector: 'app-vital-signs-trend',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule],
  templateUrl: './vital-signs-trend.component.html',
  styleUrl: './vital-signs-trend.component.css'
})
export class VitalSignsTrendComponent {
  private vitalSignService = inject(VitalSignService);

  patientId: number | null = null;
  loading = false;
  error: string | null = null;
  vitals: VitalSign[] = [];

  activeMetric: 'bp' | 'hr' | 'spo2' | 'weight' | 'gfr' = 'bp';

  chartSeries: ApexAxisChartSeries = [];
  chart: ApexChart = { type: 'line', height: 320, toolbar: { show: false }, fontFamily: 'inherit' };
  xaxis: ApexXAxis = { type: 'category', categories: [] };
  yaxis: ApexYAxis = { labels: { style: { fontSize: '12px' } } };
  stroke: ApexStroke = { curve: 'smooth', width: 2 };
  tooltip: ApexTooltip = { x: { format: 'dd MMM yyyy' } };
  grid: ApexGrid = { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } };

  loadTrend(): void {
    const pid = this.patientId;
    if (pid == null || pid < 1) {
      this.error = 'Enter a valid Patient ID';
      return;
    }
    this.error = null;
    this.loading = true;
    this.vitalSignService.getByPatient(pid, { limit: 50 }).subscribe({
      next: (list) => {
        this.vitals = list.sort((a, b) =>
          new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
        );
        this.updateChart();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load vital signs';
        this.loading = false;
      }
    });
  }

  setMetric(m: 'bp' | 'hr' | 'spo2' | 'weight' | 'gfr'): void {
    this.activeMetric = m;
    this.updateChart();
  }

  private updateChart(): void {
    const categories = this.vitals.map(v =>
      new Date(v.measurementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    this.xaxis = { ...this.xaxis, categories };

    switch (this.activeMetric) {
      case 'bp':
        this.chartSeries = [
          { name: 'Systolic BP', data: this.vitals.map(v => v.systolicBP ?? null) },
          { name: 'Diastolic BP', data: this.vitals.map(v => v.diastolicBP ?? null) }
        ];
        break;
      case 'hr':
        this.chartSeries = [{ name: 'Heart rate', data: this.vitals.map(v => v.heartRate ?? null) }];
        break;
      case 'spo2':
        this.chartSeries = [{ name: 'SpO2 (%)', data: this.vitals.map(v => v.spo2 ?? null) }];
        break;
      case 'weight':
        this.chartSeries = [{ name: 'Weight (kg)', data: this.vitals.map(v => v.weight ?? null) }];
        break;
      case 'gfr':
        this.chartSeries = [{
          name: 'GFR',
          data: this.vitals.map(v => v.renalFunction?.gfr ?? null)
        }];
        break;
    }
  }
}
