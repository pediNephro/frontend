import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LabResultsApiService } from '../../../shared/services/lab-results-api.service';
import { LabReportStatistics } from '../../../shared/models/lab-report-statistics.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-lab-reports-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lab-reports-statistics.component.html',
})
export class LabReportsStatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  stats?: LabReportStatistics;
  loading = false;
  error?: string;

  fromDate = '';
  toDate = '';

  private trendChart?: Chart;
  private statusChart?: Chart;

  constructor(private api: LabResultsApiService) {}

  ngOnInit(): void {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 30);
    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = past.toISOString().split('T')[0];
    this.load();
  }

  ngAfterViewInit(): void {}

  load(): void {
    this.loading = true;
    this.error = undefined;
    this.api.getStatistics(this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        setTimeout(() => this.buildCharts(), 100);
      },
      error: () => {
        this.loading = false;
        this.error = 'Erreur lors du chargement des statistiques.';
      }
    });
  }

  private buildCharts(): void {
    this.buildTrendChart();
    this.buildStatusChart();
  }

  private buildTrendChart(): void {
    if (!this.trendChartRef?.nativeElement || !this.stats) return;
    this.trendChart?.destroy();
    const points = this.stats.dailyAbnormalReports ?? [];
    this.trendChart = new Chart(this.trendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: points.map(p => p.date),
        datasets: [
          {
            label: 'Total rapports',
            data: points.map(p => p.totalReports),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Rapports anormaux',
            data: points.map(p => p.abnormalReports),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.3,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private buildStatusChart(): void {
    if (!this.statusChartRef?.nativeElement || !this.stats) return;
    this.statusChart?.destroy();
    const dist = this.stats.statusDistribution ?? {};
    const labels = Object.keys(dist);
    const values = Object.values(dist);
    const colors = labels.map(l => l === 'ABNORMAL' ? '#ef4444' : '#22c55e');
    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderWidth: 2 }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
    this.statusChart?.destroy();
  }
}
