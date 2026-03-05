import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComplicationService } from '../../../../core/services/transplant/complication.service';
import {
  Complication,
  ComplicationDTO,
  ComplicationType,
  ComplicationSeverity,
  ComplicationStatus
} from '../../../../core/models/transplant/complication.model';

@Component({
  selector: 'app-complication-form',
  standalone: true,
  templateUrl: './complication-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ComplicationFormComponent implements OnInit {

  @Input() transplantId!: number;
  @Output() saved = new EventEmitter<Complication>();

  form!: FormGroup;
  isLoading = false;
  error?: string;
  successMessage?: string;

  complicationTypes = Object.values(ComplicationType);
  severities = Object.values(ComplicationSeverity);
  statuses = Object.values(ComplicationStatus);

  constructor(
    private fb: FormBuilder,
    private complicationService: ComplicationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transplantId: [this.transplantId, Validators.required],
      complicationType: ['', Validators.required],
      subType: [''],
      appearanceDate: ['', Validators.required],
      severity: ['', Validators.required],
      description: ['', Validators.required],
      treatment: [''],
      status: [ComplicationStatus.ACTIVE, Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getFieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const dto: ComplicationDTO = {
      ...this.form.value,
      appearanceDate: new Date(this.form.value.appearanceDate).toISOString()
    };

    this.complicationService.create(dto).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.successMessage = 'Complication record saved successfully.';
        this.saved.emit(result);
        this.form.reset({
          transplantId: this.transplantId,
          status: ComplicationStatus.ACTIVE
        });
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to save complication record.';
      }
    });
  }
}