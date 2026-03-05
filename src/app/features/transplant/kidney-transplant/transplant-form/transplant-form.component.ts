import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KidneyTransplantService } from '../../../../core/services/transplant/kidney-transplant.service';
import { 
  KidneyTransplant, 
  KidneyTransplantDTO,
  DonorType,
  GraftStatus 
} from '../../../../core/models/transplant/kidney-transplant.model';
import { 
  HLACompatibilityDTO,
  CrossMatchResult 
} from '../../../../core/models/transplant/hla-compatibility.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transplant-form',
  standalone: true,
  templateUrl: './transplant-form.component.html',
  styleUrls: ['./transplant-form.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class TransplantFormComponent implements OnInit {

  @Input() patientId!: number;
  @Output() saved = new EventEmitter<KidneyTransplant>();

  transplantForm!: FormGroup;
  hlaForm!: FormGroup;

  currentStep = 1;
  isLoading = false;
  createdTransplantId?: number;
  error?: string;

  donorTypes = Object.values(DonorType);
  graftStatuses = Object.values(GraftStatus);
  crossMatchResults = Object.values(CrossMatchResult);
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private fb: FormBuilder,
    private transplantService: KidneyTransplantService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.transplantForm = this.fb.group({
      patientId: [this.patientId, Validators.required],
      transplantDate: ['', Validators.required],
      donorType: ['', Validators.required],
      donorBloodGroup: ['', Validators.required],
      coldIschemiaTime: ['', [Validators.required, Validators.min(0)]],
      graftStatus: [GraftStatus.ACTIVE, Validators.required],
      surgicalReportPath: ['']
    });

    this.hlaForm = this.fb.group({
      donorHlaA: ['', Validators.required],
      donorHlaB: ['', Validators.required],
      donorHlaDr: ['', Validators.required],
      recipientHlaA: ['', Validators.required],
      recipientHlaB: ['', Validators.required],
      recipientHlaDr: ['', Validators.required],
      crossMatchResult: ['', Validators.required]
    });
  }

  // 🔹 Helpers for validation UI
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['min']) return 'Value must be positive';

    return 'Invalid value';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.transplantForm.valid) {
      this.saveTransplantInfo();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  saveTransplantInfo(): void {
    if (!this.transplantForm.valid) return;

    this.isLoading = true;
    this.error = undefined;

    const formValue = this.transplantForm.value;

    const transplantDTO: KidneyTransplantDTO = {
      ...formValue,
      transplantDate: new Date(formValue.transplantDate).toISOString()
    };

    this.transplantService.create(transplantDTO).subscribe({
      next: (result) => {
        this.createdTransplantId = result.id;
        this.currentStep = 2;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create transplant record';
        this.isLoading = false;
      }
    });
  }

  saveHLACompatibility(): void {
    if (!this.hlaForm.valid || !this.createdTransplantId) return;

    this.isLoading = true;
    this.error = undefined;

    const hlaDTO: HLACompatibilityDTO = {
      transplantId: this.createdTransplantId,
      ...this.hlaForm.value
    };

    this.transplantService.createHLACompatibility(hlaDTO).subscribe({
      next: () => {
        this.transplantService.generateDefaultProtocol(this.createdTransplantId!).subscribe({
          next: () => {
            this.isLoading = false;
            this.saved.emit({ id: this.createdTransplantId } as KidneyTransplant);
            this.resetForms();
          },
          error: () => {
            this.error = 'Protocol generation failed';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to save HLA compatibility';
        this.isLoading = false;
      }
    });
  }

  resetForms(): void {
    this.transplantForm.reset({
      patientId: this.patientId,
      graftStatus: GraftStatus.ACTIVE
    });
    this.hlaForm.reset();
    this.currentStep = 1;
    this.createdTransplantId = undefined;
  }
}
