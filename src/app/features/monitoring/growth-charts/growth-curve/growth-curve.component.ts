import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip, ApexGrid } from 'ng-apexcharts';
import { GrowthChartService } from '../../../../core/services/monitoring/growth-chart.service';
import { GrowthChart } from '../../../../core/models/monitoring';

@Component({
  selector: 'app-growth-curve',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule],
  templateUrl: './growth-curve.component.html',
  styleUrl: './growth-curve.component.css'
})
export class GrowthCurveComponent {
  private growthChartService = inject(GrowthChartService);

  patientId: number | null = null;
  chartType: 'WEIGHT' | 'HEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE' = 'WEIGHT';
  loading = false;
  error: string | null = null;
  data: GrowthChart[] = [];

  chartTypes = [
    { value: 'WEIGHT' as const, label: 'Weight (kg)' },
    { value: 'HEIGHT' as const, label: 'Height (cm)' },
    { value: 'BMI' as const, label: 'BMI' },
    { value: 'HEAD_CIRCUMFERENCE' as const, label: 'Head circumference (cm)' }
  ];

  series: ApexAxisChartSeries = [];
  chart: ApexChart = {
    type: 'line',
    height: 360,
    toolbar: { show: false },
    fontFamily: 'inherit'
  };
  xaxis: ApexXAxis = { type: 'category', categories: [], title: { text: 'Age (months)' } };
  yaxis: ApexYAxis = { title: { text: 'Value' }, labels: { style: { fontSize: '12px' } } };
  stroke: ApexStroke = { curve: 'smooth', width: 3 };
  tooltip: ApexTooltip = { x: { formatter: (val: string) => `Age: ${val} months` } };
  grid: ApexGrid = { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } };

  loadCurve(): void {
    const pid = this.patientId;
    if (pid == null || pid < 1) {
      this.error = 'Enter a valid Patient ID';
      return;
    }
    this.error = null;
    this.loading = true;
    this.growthChartService.getAll(pid, this.chartType, { limit: 200 }).subscribe({
      next: (list) => {
        this.data = list.sort((a, b) => a.ageMonths - b.ageMonths);
        this.buildChart();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load growth data';
        this.loading = false;
      }
    });
  }

  private buildChart(): void {
    const categories = this.data.map(d => String(d.ageMonths));
    const values = this.data.map(d => d.value);
    const percentiles = this.data.map(d => d.percentile ?? null);
    this.series = [
      { name: 'Value', data: values },
      { name: 'Percentile', data: percentiles }
    ];
    this.xaxis = { ...this.xaxis, categories };
  }

  getUnit(): string {
    switch (this.chartType) {
      case 'WEIGHT': return 'kg';
      case 'HEIGHT': case 'HEAD_CIRCUMFERENCE': return 'cm';
      default: return '';
    }
  }

  getChartTypeLabel(): string {
    const t = this.chartTypes.find(t => t.value === this.chartType);
    return t?.label ?? this.chartType;
  }
}
