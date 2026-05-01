import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImmunosuppressantService } from '../../../../core/services/transplant/immunosuppressant.service';
import { Immunosuppressant } from '../../../../core/models/transplant/immunosuppressant.model';

@Component({
  selector: 'app-immunosuppressant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
        <h3 class="font-medium text-black dark:text-white">Drug Record Details</h3>
        <a [routerLink]="['/kidney-transplants', transplantId, 'immunosuppressants', id, 'edit']" 
           class="text-primary hover:underline">Edit Record</a>
      </div>
      
      <div class="p-6.5" *ngIf="drug">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="block text-sm font-medium text-gray-500">Drug Name</span>
            <span class="text-black dark:text-white text-lg font-semibold">{{ drug.drugName }}</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Current Status</span>
            <span class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                  [ngClass]="drug.isActive ? 'bg-success text-success' : 'bg-danger text-danger'">
              {{ drug.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Current Dose</span>
            <span class="text-black dark:text-white">{{ drug.currentDose }} mg</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Start Date</span>
            <span class="text-black dark:text-white">{{ drug.startDate | date:'fullDate' }}</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Target Range</span>
            <span class="text-black dark:text-white">{{ drug.targetTroughMin }} - {{ drug.targetTroughMax }} ng/mL</span>
          </div>
          <div>
            <span class="block text-sm font-medium text-gray-500">Last Measured Trough Level</span>
            <span class="text-black dark:text-white">{{ drug.lastTroughLevel || 'Not measured yet' }}</span>
          </div>
          <div *ngIf="drug.lastMeasurementDate">
            <span class="block text-sm font-medium text-gray-500">Last Measurement Date</span>
            <span class="text-black dark:text-white">{{ drug.lastMeasurementDate | date }}</span>
          </div>
        </div>

        <div class="mt-8 border-t border-stroke pt-4 dark:border-strokedark">
            <a [routerLink]="['/kidney-transplants', transplantId, 'immunosuppressants']" 
               class="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                ← Back to List
            </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-success { color: #10b981; }
    .text-danger { color: #ff5c5c; }
  `]
})
export class ImmunosuppressantDetailComponent implements OnInit {
  @Input() transplantId!: string;
  @Input() id!: string;
  drug?: Immunosuppressant;

  constructor(
    private drugService: ImmunosuppressantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    if (!this.transplantId) this.transplantId = params.get('transplantId') ?? '';
    if (!this.id) this.id = params.get('id') ?? '';

    if (this.id) {
      this.drugService.getById(+this.id).subscribe(data => this.drug = data);
    }
  }
}
