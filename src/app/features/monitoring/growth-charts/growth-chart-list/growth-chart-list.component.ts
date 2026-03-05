// File: src/app/pages/growth-charts/growth-chart-list/growth-chart-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GrowthChart } from '../../../../core/models/monitoring';
import { GrowthChartService } from '../../../../core/services/monitoring/growth-chart.service';

@Component({
  selector: 'app-growth-chart-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './growth-chart-list.component.html',
  styleUrl: './growth-chart-list.component.css'
})
export class GrowthChartListComponent implements OnInit {
  growthCharts: GrowthChart[] = [];
  filteredCharts: GrowthChart[] = [];
  
  loading = false;
  error: string | null = null;
  
  // Filters
  searchTerm = '';
  filterPatientId: number | null = null;
  filterChartType: string = '';
  filterAbnormal: string = ''; // 'all', 'normal', 'abnormal'
  dateFrom = '';
  dateTo = '';
  limit = 100;
  limitOptions = [25, 50, 100, 250, 500];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Delete modal
  showDeleteModal = false;
  chartToDelete: GrowthChart | null = null;
  
  successMessage: string | null = null;

  // Chart type options
  chartTypes = [
    { value: 'WEIGHT', label: 'Weight' },
    { value: 'HEIGHT', label: 'Height' },
    { value: 'BMI', label: 'BMI' },
    { value: 'HEAD_CIRCUMFERENCE', label: 'Head Circumference' }
  ];

  constructor(private growthChartService: GrowthChartService) {}

  ngOnInit(): void {
    this.loadGrowthCharts();
  }

  loadGrowthCharts(): void {
    this.loading = true;
    this.error = null;

    const timeSeries: { from?: string; to?: string; limit?: number } = { limit: this.limit };
    if (this.dateFrom) timeSeries.from = new Date(this.dateFrom + 'T00:00:00').toISOString();
    if (this.dateTo) timeSeries.to = new Date(this.dateTo + 'T23:59:59.999').toISOString();

    this.growthChartService.getAll(
      this.filterPatientId || undefined,
      this.filterChartType || undefined,
      timeSeries
    ).subscribe({
      next: (data) => {
        this.growthCharts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load growth charts. Please try again.';
        this.loading = false;
        console.error('Error loading growth charts:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.growthCharts];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(gc => 
        gc.patientId.toString().includes(term) ||
        gc.chartType.toLowerCase().includes(term)
      );
    }

    // Abnormal filter
    if (this.filterAbnormal === 'normal') {
      filtered = filtered.filter(gc => !gc.abnormal);
    } else if (this.filterAbnormal === 'abnormal') {
      filtered = filtered.filter(gc => gc.abnormal);
    }

    this.filteredCharts = filtered;
    this.totalPages = Math.ceil(this.filteredCharts.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedCharts(): GrowthChart[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCharts.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterPatientId = null;
    this.filterChartType = '';
    this.filterAbnormal = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.limit = 100;
    this.loadGrowthCharts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  openDeleteModal(chart: GrowthChart): void {
    this.chartToDelete = chart;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.chartToDelete = null;
  }

  confirmDelete(): void {
    if (this.chartToDelete?.id) {
      this.growthChartService.deleteById(this.chartToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Growth chart deleted successfully';
          this.closeDeleteModal();
          this.loadGrowthCharts();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete growth chart';
          console.error('Delete error:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  getChartTypeLabel(type: string): string {
    const chartType = this.chartTypes.find(ct => ct.value === type);
    return chartType?.label || type;
  }

  getChartTypeIcon(type: string): string {
    switch (type) {
      case 'WEIGHT': return '⚖️';
      case 'HEIGHT': return '📏';
      case 'BMI': return '📊';
      case 'HEAD_CIRCUMFERENCE': return '👶';
      default: return '📈';
    }
  }

  getChartTypeUnit(type: string): string {
    switch (type) {
      case 'WEIGHT': return 'kg';
      case 'HEIGHT': return 'cm';
      case 'BMI': return '';
      case 'HEAD_CIRCUMFERENCE': return 'cm';
      default: return '';
    }
  }

  getPercentileClass(percentile: number | undefined): string {
    if (percentile === undefined || percentile === null) return 'bg-gray-100 text-gray-800';
    
    if (percentile < 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (percentile < 25) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (percentile <= 75) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (percentile <= 95) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  }

  getPercentileLabel(percentile: number | undefined): string {
    if (percentile === undefined || percentile === null) return 'N/A';
    
    if (percentile < 5) return 'Below 5th';
    if (percentile < 25) return '5th-25th';
    if (percentile <= 75) return '25th-75th';
    if (percentile <= 95) return '75th-95th';
    return 'Above 95th';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  get abnormalCount(): number {
    return this.growthCharts.filter(gc => gc.abnormal).length;
  }

  get normalCount(): number {
    return this.growthCharts.filter(gc => !gc.abnormal).length;
  }
}