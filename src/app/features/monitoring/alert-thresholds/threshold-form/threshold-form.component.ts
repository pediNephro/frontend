// File: src/app/pages/alert-thresholds/threshold-form/threshold-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertThreshold, AlertThresholdCreateDTO } from '../../../../core/models/monitoring';
import { AlertThresholdService } from '../../../../core/services/monitoring/alert-threshold.service';

@Component({
  selector: 'app-threshold-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './threshold-form.component.html',
  styleUrl: './threshold-form.component.css'
})
export class ThresholdFormComponent implements OnInit {
  thresholdForm!: FormGroup;
  isEditMode = false;
  thresholdId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  // Parameter options
  parameters = [
    { value: 'SYSTOLIC_BP', label: 'Systolic Blood Pressure (mmHg)' },
    { value: 'DIASTOLIC_BP', label: 'Diastolic Blood Pressure (mmHg)' },
    { value: 'HEART_RATE', label: 'Heart Rate (bpm)' },
    { value: 'TEMPERATURE', label: 'Temperature (°C)' },
    { value: 'SPO2', label: 'SpO2 (%)' },
    { value: 'GFR', label: 'GFR (mL/min/1.73m²)' },
    { value: 'CREATININE', label: 'Creatinine (mg/dL)' },
    { value: 'URINE_OUTPUT', label: 'Urine Output (mL)' }
  ];

  // Severity options
  severities = [
    { value: 'INFO', label: 'Info', class: 'bg-blue-500' },
    { value: 'WARNING', label: 'Warning', class: 'bg-yellow-500' },
    { value: 'CRITICAL', label: 'Critical', class: 'bg-red-500' }
  ];

  constructor(
    private fb: FormBuilder,
    private thresholdService: AlertThresholdService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.thresholdForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      parameter: ['', Validators.required],
      minThreshold: ['', [Validators.min(0)]],
      maxThreshold: ['', [Validators.min(0)]],
      severity: ['WARNING', Validators.required],
      customMessage: [''],
      active: [true],
      createdBy: ['', [Validators.required, Validators.min(1)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.thresholdId = +id;
      this.loadThreshold();
    }
  }

  loadThreshold(): void {
    if (!this.thresholdId) return;

    this.loading = true;
    this.error = null;

    this.thresholdService.getById(this.thresholdId).subscribe({
      next: (data) => {
        this.populateForm(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load threshold data';
        this.loading = false;
        console.error('Error loading threshold:', err);
      }
    });
  }

  populateForm(threshold: AlertThreshold): void {
    this.thresholdForm.patchValue({
      patientId: threshold.patientId,
      parameter: threshold.parameter,
      minThreshold: threshold.minThreshold,
      maxThreshold: threshold.maxThreshold,
      severity: threshold.severity,
      customMessage: threshold.customMessage,
      active: threshold.active,
      createdBy: threshold.createdBy
    });
  }

  onSubmit(): void {
    if (this.thresholdForm.invalid) {
      this.markFormGroupTouched(this.thresholdForm);
      return;
    }

    // Validate that at least one threshold is set
    const minThreshold = this.thresholdForm.get('minThreshold')?.value;
    const maxThreshold = this.thresholdForm.get('maxThreshold')?.value;

    if (!minThreshold && !maxThreshold) {
      this.error = 'Please set at least one threshold (Min or Max)';
      return;
    }

    // Validate min < max if both are set
    if (minThreshold && maxThreshold && minThreshold >= maxThreshold) {
      this.error = 'Min threshold must be less than Max threshold';
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.thresholdForm.value;
    
    const dto: any = {
      patientId: formValue.patientId,
      parameter: formValue.parameter,
      severity: formValue.severity,
      customMessage: formValue.customMessage || undefined,
      createdBy: formValue.createdBy
    };

    // Add thresholds only if they have values
    if (formValue.minThreshold) dto.minThreshold = formValue.minThreshold;
    if (formValue.maxThreshold) dto.maxThreshold = formValue.maxThreshold;

    if (this.isEditMode && this.thresholdId) {
      dto.active = formValue.active;
      this.updateThreshold(dto);
    } else {
      this.createThreshold(dto);
    }
  }

  createThreshold(dto: AlertThresholdCreateDTO): void {
    this.thresholdService.create(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/thresholds']);
      },
      error: (err) => {
        this.error = 'Failed to create threshold';
        this.submitting = false;
        console.error('Create error:', err);
      }
    });
  }

  updateThreshold(dto: Partial<AlertThreshold>): void {
    if (!this.thresholdId) return;

    this.thresholdService.update(this.thresholdId, dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/thresholds']);
      },
      error: (err) => {
        this.error = 'Failed to update threshold';
        this.submitting = false;
        console.error('Update error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/thresholds']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.thresholdForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.thresholdForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'This field is required';
    }
    if (field?.errors?.['min']) {
      return `Minimum value is ${field.errors['min'].min}`;
    }
    
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getSeverityClass(severity: string): string {
    const sev = this.severities.find(s => s.value === severity);
    return sev?.class || 'bg-gray-500';
  }
}