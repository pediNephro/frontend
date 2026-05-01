import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImmunosuppressantService } from '../../../../core/services/transplant/immunosuppressant.service';
import { ImmunosuppressantDTO, DrugName } from '../../../../core/models/transplant/immunosuppressant.model';

@Component({
  selector: 'app-immunosuppressant-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 class="font-medium text-black dark:text-white">
          {{ isEditMode ? 'Edit' : 'Add' }} Immunosuppressant Drug
        </h3>
      </div>
      <form (ngSubmit)="save()" class="p-6.5">
        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-black dark:text-white">Drug Name</label>
            <select [(ngModel)]="drug.drugName" name="drugName" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <option *ngFor="let name of drugNames" [value]="name">{{ name }}</option>
            </select>
          </div>
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-black dark:text-white">Current Dose (mg)</label>
            <input type="number" [(ngModel)]="drug.currentDose" name="currentDose" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
          </div>
        </div>

        <div class="mb-4.5">
          <label class="mb-2.5 block text-black dark:text-white">Start Date</label>
          <input type="date" [(ngModel)]="drug.startDate" name="startDate" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
        </div>

        <div class="mb-4.5 grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2.5 block text-black dark:text-white">Target Trough Min</label>
            <input type="number" step="0.1" [(ngModel)]="drug.targetTroughMin" name="targetTroughMin" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
          </div>
          <div>
            <label class="mb-2.5 block text-black dark:text-white">Target Trough Max</label>
            <input type="number" step="0.1" [(ngModel)]="drug.targetTroughMax" name="targetTroughMax" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input" />
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center cursor-pointer select-none text-black dark:text-white">
            <input type="checkbox" [(ngModel)]="drug.isActive" name="isActive" class="mr-2" />
            Is Active
          </label>
        </div>

        <button type="submit" class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
          {{ isEditMode ? 'Update' : 'Save' }} Drug Record
        </button>
      </form>
    </div>
  `
})
export class ImmunosuppressantFormComponent implements OnInit {
  @Input() transplantId!: string;
  @Input() id?: string;
  
  isEditMode = false;
  drugNames = Object.values(DrugName);
  
  drug: ImmunosuppressantDTO = {
    drugName: DrugName.TACROLIMUS,
    currentDose: 0,
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
    targetTroughMin: 0,
    targetTroughMax: 0,
    transplantId: 0,
    patientId: 0,
   
  };

  constructor(
    private drugService: ImmunosuppressantService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // When used as a routed component, params come from ActivatedRoute (not @Input)
    const params = this.route.snapshot.paramMap;
    if (!this.transplantId) {
      this.transplantId = params.get('transplantId') ?? '';
    }
    if (!this.id) {
      this.id = params.get('id') ?? undefined;
    }

    if (this.id) {
      this.isEditMode = true;
      this.drugService.getById(+this.id).subscribe(data => {
        // Map entity to DTO
        this.drug = {
            drugName: data.drugName,
            currentDose: data.currentDose,
            startDate: typeof data.startDate === 'string'
              ? data.startDate
              : data.startDate.toISOString().split('T')[0],
            isActive: data.isActive,
            targetTroughMin: data.targetTroughMin,
            targetTroughMax: data.targetTroughMax,
            transplantId: +this.transplantId,
            patientId: data.patientId ?? 0
        };
      });
    }
  }

  save(): void {
    this.drug.transplantId = +this.transplantId;
    
    if (this.isEditMode && this.id) {
      this.drugService.update(+this.id, this.drug).subscribe(() => this.goBack());
    } else {
      this.drugService.create(this.drug).subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.router.navigate(['/kidney-transplants', this.transplantId, 'immunosuppressants']);
  }
}
