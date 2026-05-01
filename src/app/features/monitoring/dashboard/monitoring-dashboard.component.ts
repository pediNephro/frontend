import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexTooltip, ApexGrid } from 'ng-apexcharts';
import { AlertNotificationService } from '../../../core/services/monitoring/alert-notification.service';
import { VitalSignService } from '../../../core/services/monitoring/vital-sign.service';
import { VitalSign } from '../../../core/models/monitoring';

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule],
  templateUrl: './monitoring-dashboard.component.html',
  styleUrl: './monitoring-dashboard.component.css'
})
export class MonitoringDashboardComponent implements OnInit {
  constructor(
    public alertNotification: AlertNotificationService,
    private vitalSignService: VitalSignService
  ) {}

  latestVitals: VitalSign[] = [];
  vitalsLoading = false;
  trendPatientId: number | null = null;
  trendVitals: VitalSign[] = [];
  trendLoading = false;

  trendSeries: ApexAxisChartSeries = [];
  trendChart: ApexChart = {
    type: 'line',
    height: 220,
    toolbar: { show: false },
    fontFamily: 'inherit'
  };
  trendXAxis: ApexXAxis = { type: 'category', categories: [], labels: { rotate: -45 } };
  trendYAxis: ApexYAxis = { labels: { style: { fontSize: '12px' } } };
  trendStroke: ApexStroke = { curve: 'smooth', width: 2 };
  trendTooltip: ApexTooltip = { x: { format: 'dd MMM' } };
  trendGrid: ApexGrid = { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } };

  ngOnInit(): void {
    this.alertNotification.refresh();
    this.loadLatestVitals();
  }

  loadLatestVitals(): void {
    this.vitalsLoading = true;
    this.vitalSignService.getAll(undefined, { limit: 15 }).subscribe({
      next: (data: VitalSign[]) => {
        this.latestVitals = data;
        this.vitalsLoading = false;
      },
      error: () => { this.vitalsLoading = false; }
    });
  }

  loadTrend(): void {
    const pid = this.trendPatientId;
    if (pid == null || pid < 1) return;
    this.trendLoading = true;
    this.vitalSignService.getByPatient(pid, { limit: 30 }).subscribe({
      next: (data: VitalSign[]) => {
        this.trendVitals = data.sort((a: VitalSign, b: VitalSign) =>
          new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
        );
        this.buildTrendChart();
        this.trendLoading = false;
      },
      error: () => { this.trendLoading = false; }
    });
  }

  private buildTrendChart(): void {
    const categories = this.trendVitals.map(v =>
      new Date(v.measurementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const systolic = this.trendVitals.map(v => v.systolicBP ?? null);
    const diastolic = this.trendVitals.map(v => v.diastolicBP ?? null);
    const gfr = this.trendVitals.map(v => v.renalFunction?.gfr ?? null);

    this.trendSeries = [
      { name: 'Systolic BP', data: systolic },
      { name: 'Diastolic BP', data: diastolic },
      { name: 'GFR', data: gfr }
    ];
    this.trendXAxis = { ...this.trendXAxis, categories };
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  getBPClass(systolic?: number, diastolic?: number): string {
    if (!systolic || !diastolic) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    if (systolic >= 140 || diastolic >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (systolic < 90 || diastolic < 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }
}
