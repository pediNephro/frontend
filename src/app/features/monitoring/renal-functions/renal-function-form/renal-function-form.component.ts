// renal-function-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RenalFunctionService } from '../../../../core/services/monitoring/renal-function.service';
import { RenalFunction, RenalFunctionCreateDTO } from '../../../../core/models/monitoring/renal-function.model';

@Component({
  selector: 'app-renal-function-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './renal-function-form.component.html',
  styleUrls: ['./renal-function-form.component.css']
})
export class RenalFunctionFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  isEditMode = false;
  renalFunctionId: number | null = null;
  renalFunction: RenalFunction | null = null;

  gfrFormulas = [
    { value: 'CKD-EPI', label: 'CKD-EPI (Chronic Kidney Disease Epidemiology Collaboration)' },
    { value: 'MDRD', label: 'MDRD (Modification of Diet in Renal Disease)' },
    { value: 'Cockcroft-Gault', label: 'Cockcroft-Gault' },
    { value: 'Schwartz', label: 'Schwartz (Pediatric)' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private renalFunctionService: RenalFunctionService
  ) {
    console.log('RenalFunctionFormComponent constructor called');
    this.form = this.fb.group({
      creatinineLevel: ['', [Validators.required, Validators.min(0.1), Validators.max(50)]],
      gfrFormula: ['', Validators.required],
      vitalSignId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    console.log('RenalFunctionFormComponent ngOnInit called');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param id:', id);
    if (id) {
      this.renalFunctionId = +id;
      this.isEditMode = true;
      this.loadRenalFunction();
    }
  }

  loadRenalFunction(): void {
    if (!this.renalFunctionId) return;

    this.isLoading = true;
    this.error = null;

    this.renalFunctionService.getById(this.renalFunctionId).subscribe({
      next: (renalFunction) => {
        this.renalFunction = renalFunction;
        this.populateForm(renalFunction);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load renal function';
        this.isLoading = false;
        console.error('Error loading renal function:', error);
      }
    });
  }

  populateForm(renalFunction: RenalFunction): void {
    this.form.patchValue({
      creatinineLevel: renalFunction.creatinineLevel,
      gfrFormula: renalFunction.gfrFormula,
      vitalSignId: renalFunction.vitalSignId
    });
  }

onSubmit(): void {
  if (this.form.invalid) {
    this.markFormGroupTouched();
    return;
  }

  this.isSubmitting = true;
  this.error = null;

  const formValue = this.form.value;

  const basePayload: any = {
    creatinineLevel: Number(formValue.creatinineLevel),
    gfrFormula: formValue.gfrFormula
  };

  // ✅ Send vitalSign as object
  if (formValue.vitalSignId && +formValue.vitalSignId > 0) {
    basePayload.vitalSign = {
      id: Number(formValue.vitalSignId)
    };
  }

  if (this.isEditMode && this.renalFunctionId) {

    this.renalFunctionService.update(this.renalFunctionId, basePayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/renal-functions', this.renalFunctionId], {
          queryParams: { success: 'Renal function updated successfully' }
        });
      },
      error: (error) => {
        this.error = 'Failed to update renal function';
        this.isSubmitting = false;
        console.error('Error updating renal function:', error);
      }
    });

  } else {

    this.renalFunctionService.create(basePayload).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.router.navigate(['/renal-functions', created.id], {
          queryParams: { success: 'Renal function created successfully' }
        });
      },
      error: (error) => {
        this.error = 'Failed to create renal function';
        this.isSubmitting = false;
        console.error('Error creating renal function:', error);
      }
    });
  }
}


  onCancel(): void {
    if (this.isEditMode && this.renalFunctionId) {
      this.router.navigate(['/renal-functions', this.renalFunctionId]);
    } else {
      this.router.navigate(['/vital-signs']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFormFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${control.errors['max'].max}`;
      }
    }
    return '';
  }
}