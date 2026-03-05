
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VitalSign, VitalSignCreateDTO } from '../../../../core/models/monitoring';
import { VitalSignService } from '../../../../core/services/monitoring/vital-sign.service';

@Component({
  selector: 'app-vital-sign-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './vital-sign-form.component.html',
  styleUrl: './vital-sign-form.component.css'
})
export class VitalSignFormComponent implements OnInit {
  vitalSignForm!: FormGroup;
  isEditMode = false;
  vitalSignId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vitalSignService: VitalSignService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.vitalSignForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      enteredBy: ['', [Validators.required, Validators.min(1)]],
      measurementDate: ['', Validators.required],
      
      // Anthropometric measurements
      weight: ['', [Validators.min(0), Validators.max(500)]],
      height: ['', [Validators.min(0), Validators.max(300)]],
      headCircumference: ['', [Validators.min(0), Validators.max(100)]],
      
      // Vital signs
      systolicBP: ['', [Validators.min(0), Validators.max(300)]],
      diastolicBP: ['', [Validators.min(0), Validators.max(200)]],
      heartRate: ['', [Validators.min(0), Validators.max(300)]],
      temperature: ['', [Validators.min(30), Validators.max(45)]],
      spo2: ['', [Validators.min(0), Validators.max(100)]],
      urineOutput: ['', [Validators.min(0), Validators.max(10000)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vitalSignId = +id;
      this.loadVitalSign();
    } else {
      // Set default date to now
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      this.vitalSignForm.patchValue({ measurementDate: localDateTime });
    }
  }

  loadVitalSign(): void {
    if (!this.vitalSignId) return;

    this.loading = true;
    this.error = null;

    this.vitalSignService.getById(this.vitalSignId).subscribe({
      next: (data) => {
        this.populateForm(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vital sign data';
        this.loading = false;
        console.error('Error loading vital sign:', err);
      }
    });
  }

  populateForm(vitalSign: VitalSign): void {
    // Convert date to local datetime-local format
    const date = new Date(vitalSign.measurementDate);
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.vitalSignForm.patchValue({
      patientId: vitalSign.patientId,
      enteredBy: vitalSign.enteredBy,
      measurementDate: localDateTime,
      weight: vitalSign.weight,
      height: vitalSign.height,
      headCircumference: vitalSign.headCircumference,
      systolicBP: vitalSign.systolicBP,
      diastolicBP: vitalSign.diastolicBP,
      heartRate: vitalSign.heartRate,
      temperature: vitalSign.temperature,
      spo2: vitalSign.spo2,
      urineOutput: vitalSign.urineOutput
    });
  }

  onSubmit(): void {
    if (this.vitalSignForm.invalid) {
      this.markFormGroupTouched(this.vitalSignForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.vitalSignForm.value;
    
    // Convert datetime-local to ISO string
    const measurementDate = new Date(formValue.measurementDate).toISOString();
    
    // Build DTO with only non-empty values
    const dto: any = {
      patientId: formValue.patientId,
      enteredBy: formValue.enteredBy,
      measurementDate: measurementDate
    };

    // Add optional fields only if they have values
    if (formValue.weight) dto.weight = formValue.weight;
    if (formValue.height) dto.height = formValue.height;
    if (formValue.headCircumference) dto.headCircumference = formValue.headCircumference;
    if (formValue.systolicBP) dto.systolicBP = formValue.systolicBP;
    if (formValue.diastolicBP) dto.diastolicBP = formValue.diastolicBP;
    if (formValue.heartRate) dto.heartRate = formValue.heartRate;
    if (formValue.temperature) dto.temperature = formValue.temperature;
    if (formValue.spo2) dto.spo2 = formValue.spo2;
    if (formValue.urineOutput) dto.urineOutput = formValue.urineOutput;

    if (this.isEditMode && this.vitalSignId) {
      this.updateVitalSign(dto);
    } else {
      this.createVitalSign(dto);
    }
  }

  createVitalSign(dto: VitalSignCreateDTO): void {
    this.vitalSignService.create(dto).subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/vital-signs', response.id]);
      },
      error: (err) => {
        this.error = 'Failed to create vital sign';
        this.submitting = false;
        console.error('Create error:', err);
      }
    });
  }

  updateVitalSign(dto: Partial<VitalSign>): void {
    if (!this.vitalSignId) return;

    this.vitalSignService.update(this.vitalSignId, dto).subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/vital-signs', response.id]);
      },
      error: (err) => {
        this.error = 'Failed to update vital sign';
        this.submitting = false;
        console.error('Update error:', err);
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.vitalSignId) {
      this.router.navigate(['/vital-signs', this.vitalSignId]);
    } else {
      this.router.navigate(['/vital-signs']);
    }
  }

  // Calculate BMI if weight and height are provided
  calculateBMI(): void {
    const weight = this.vitalSignForm.get('weight')?.value;
    const height = this.vitalSignForm.get('height')?.value;

    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      console.log('Calculated BMI:', bmi.toFixed(2));
      // You could add this to a display field or send it to the backend
    }
  }

  // Validation helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.vitalSignForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.vitalSignForm.get(fieldName);
    
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

  // Blood pressure validation
  validateBloodPressure(): string | null {
    const systolic = this.vitalSignForm.get('systolicBP')?.value;
    const diastolic = this.vitalSignForm.get('diastolicBP')?.value;

    if (systolic && diastolic && systolic <= diastolic) {
      return 'Systolic BP must be greater than Diastolic BP';
    }

    return null;
  }
}