// File: src/app/pages/growth-charts/growth-chart-form/growth-chart-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GrowthChartCreateDTO } from '../../../../core/models/monitoring';
import { GrowthChartService } from '../../../../core/services/monitoring/growth-chart.service';

@Component({
  selector: 'app-growth-chart-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './growth-chart-form.component.html',
  styleUrl: './growth-chart-form.component.css'
})
export class GrowthChartFormComponent implements OnInit {
  chartForm!: FormGroup;
  submitting = false;
  error: string | null = null;

  // Chart type options with ranges
  chartTypes = [
    { 
      value: 'WEIGHT', 
      label: 'Weight',
      icon: '⚖️',
      unit: 'kg',
      minValue: 0.5,
      maxValue: 150,
      description: 'Track weight progression'
    },
    { 
      value: 'HEIGHT', 
      label: 'Height',
      icon: '📏',
      unit: 'cm',
      minValue: 30,
      maxValue: 200,
      description: 'Track height/length progression'
    },
    { 
      value: 'BMI', 
      label: 'BMI',
      icon: '📊',
      unit: '',
      minValue: 5,
      maxValue: 50,
      description: 'Body Mass Index'
    },
    { 
      value: 'HEAD_CIRCUMFERENCE', 
      label: 'Head Circumference',
      icon: '👶',
      unit: 'cm',
      minValue: 25,
      maxValue: 65,
      description: 'For infants and young children'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private growthChartService: GrowthChartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.chartForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      chartType: ['', Validators.required],
      ageMonths: ['', [Validators.required, Validators.min(0), Validators.max(216)]], // 0-18 years
      value: ['', [Validators.required, Validators.min(0)]]
    });

    // Update value validators when chart type changes
    this.chartForm.get('chartType')?.valueChanges.subscribe(type => {
      this.updateValueValidators(type);
    });
  }

  updateValueValidators(chartType: string): void {
    const valueControl = this.chartForm.get('value');
    const selectedType = this.chartTypes.find(ct => ct.value === chartType);

    if (selectedType && valueControl) {
      valueControl.setValidators([
        Validators.required,
        Validators.min(selectedType.minValue),
        Validators.max(selectedType.maxValue)
      ]);
      valueControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.chartForm.invalid) {
      this.markFormGroupTouched(this.chartForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const dto: GrowthChartCreateDTO = this.chartForm.value;

    this.growthChartService.create(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/growth-charts']);
      },
      error: (err) => {
        this.error = 'Failed to create growth chart';
        this.submitting = false;
        console.error('Create error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/growth-charts']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chartForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.chartForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'This field is required';
    }
    if (field?.errors?.['min']) {
      return `Minimum value is ${field.errors['min'].min}`;
    }
    if (field?.errors?.['max']) {
      return `Maximum value is ${field.errors['max'].max}`;
    }
    
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getSelectedChartType() {
    const type = this.chartForm.get('chartType')?.value;
    return this.chartTypes.find(ct => ct.value === type);
  }

  getAgeYears(): string {
    const ageMonths = this.chartForm.get('ageMonths')?.value;
    if (!ageMonths || ageMonths < 0) return '';
    
    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;
    
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  }
}