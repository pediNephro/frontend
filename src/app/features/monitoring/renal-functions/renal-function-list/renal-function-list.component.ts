// renal-function-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RenalFunctionService } from '../../../../core/services/monitoring/renal-function.service';
import { RenalFunction } from '../../../../core/models/monitoring/renal-function.model';

@Component({
  selector: 'app-renal-function-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renal-function-list.component.html',
  styleUrls: ['./renal-function-list.component.css']
})
export class RenalFunctionListComponent implements OnInit {
  renalFunctions: RenalFunction[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private renalFunctionService: RenalFunctionService) {}

  ngOnInit(): void {
    this.loadRenalFunctions();
  }

  loadRenalFunctions(): void {
    this.isLoading = true;
    this.error = null;

    this.renalFunctionService.getAll().subscribe({
      next: (data) => {
        this.renalFunctions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load renal function data';
        this.isLoading = false;
        console.error('Error loading renal functions:', err);
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getGfrStatus(gfr: number | undefined): { text: string; color: string } {
    if (!gfr) return { text: 'Not calculated', color: 'text-gray-500' };

    if (gfr >= 90) return { text: 'Normal', color: 'text-green-600' };
    if (gfr >= 60) return { text: 'Mild reduction', color: 'text-yellow-600' };
    if (gfr >= 30) return { text: 'Moderate reduction', color: 'text-orange-600' };
    if (gfr >= 15) return { text: 'Severe reduction', color: 'text-red-600' };
    return { text: 'Kidney failure', color: 'text-red-800' };
  }
}