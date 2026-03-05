import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KidneyTransplantService } from '../../../../core/services/transplant/kidney-transplant.service';
import { KidneyTransplant, GraftStatus } from '../../../../core/models/transplant/kidney-transplant.model';

@Component({
  selector: 'app-transplant-list',
  standalone: true,
  templateUrl: './transplant-list.component.html',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class TransplantListComponent implements OnInit {

  transplants: KidneyTransplant[] = [];
  filtered: KidneyTransplant[] = [];
  isLoading = true;
  error?: string;
  searchTerm = '';
  selectedStatus = '';

  graftStatuses = Object.values(GraftStatus);

  constructor(private transplantService: KidneyTransplantService) {}

  ngOnInit(): void {
    this.transplantService.getAll().subscribe({
      next: (data) => {
        this.transplants = data;
        this.filtered = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load transplant records.';
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filtered = this.transplants.filter(t => {
      const matchesStatus = !this.selectedStatus || t.graftStatus === this.selectedStatus;
      const matchesSearch = !this.searchTerm ||
        t.id?.toString().includes(this.searchTerm) ||
        t.donorBloodGroup?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.donorType?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  getGraftStatusClass(status: string): string {
    switch (status) {
      case GraftStatus.ACTIVE:   return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case GraftStatus.REJECTED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case GraftStatus.LOST:     return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  get activeCount(): number {
    return this.transplants.filter(t => t.graftStatus === GraftStatus.ACTIVE).length;
  }

  getDonorTypeClass(type: string): string {
    return type === 'LIVING'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
  }
}