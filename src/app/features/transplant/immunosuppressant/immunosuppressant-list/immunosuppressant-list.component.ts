import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImmunosuppressantService } from '../../../../core/services/transplant/immunosuppressant.service';
import { Immunosuppressant } from '../../../../core/models/transplant/immunosuppressant.model';

@Component({
  selector: 'app-immunosuppressant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">Drug Monitoring (Immunosuppressants)</h3>
        <a [routerLink]="['/kidney-transplants', transplantId, 'immunosuppressants', 'new']" 
           class="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90">
          Add Drug
        </a>
      </div>

      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-4 px-4 font-medium text-black dark:text-white">Drug Name</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Dose</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Last Trough</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let drug of drugs" class="border-b border-[#eee] dark:border-strokedark">
              <td class="py-5 px-4"><p class="text-black dark:text-white font-medium">{{ drug.drugName }}</p></td>
              <td class="py-5 px-4"><p class="text-black dark:text-white">{{ drug.currentDose }} mg</p></td>
              <td class="py-5 px-4"><p class="text-black dark:text-white">{{ drug.startDate | date }}</p></td>
              <td class="py-5 px-4">
                <span class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                      [ngClass]="drug.isActive ? 'bg-success text-success' : 'bg-danger text-danger'">
                  {{ drug.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-5 px-4">
                <p [ngClass]="getStatusClass(drug.levelStatus)">
                  {{ drug.lastTroughLevel || 'N/A' }}
                </p>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center space-x-3.5">
                  <a [routerLink]="['/kidney-transplants', transplantId, 'immunosuppressants', drug.id]" class="hover:text-primary">View</a>
                  <a [routerLink]="['/kidney-transplants', transplantId, 'immunosuppressants', drug.id, 'edit']" class="hover:text-primary">Edit</a>
                </div>
              </td>
            </tr>
            <tr *ngIf="drugs.length === 0">
              <td colspan="6" class="py-5 px-4 text-center text-gray-500">No drug monitoring records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .text-success { color: #10b981; }
    .text-danger { color: #ff5c5c; }
    .text-warning { color: #f59e0b; }
  `]
})
export class ImmunosuppressantListComponent implements OnInit {
  @Input() transplantId!: string;
  drugs: Immunosuppressant[] = [];

  constructor(
    private drugService: ImmunosuppressantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.transplantId) {
      this.transplantId = this.route.snapshot.paramMap.get('transplantId') ?? '';
    }
    if (this.transplantId) {
      this.loadDrugs();
    }
  }

  loadDrugs(): void {
    this.drugService.getByTransplantId(+this.transplantId).subscribe({
      next: (data) => this.drugs = data,
      error: (err) => console.error('Error loading drugs', err)
    });
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'NORMAL': return 'text-success';
      case 'HIGH': return 'text-danger';
      case 'LOW': return 'text-warning';
      default: return 'text-black dark:text-white';
    }
  }
}
