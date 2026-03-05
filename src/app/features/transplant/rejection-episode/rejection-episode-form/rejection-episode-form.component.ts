import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RejectionService } from '../../../../core/services/transplant/rejection.service';
import {
  RejectionEpisode,
  RejectionEpisodeDTO,
  RejectionType,
  RejectionSeverity,
  RejectionStatus
} from '../../../../core/models/transplant/rejection-episode.model';

@Component({
  selector: 'app-rejection-episode-form',
  standalone: true,
  templateUrl: './rejection-episode-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class RejectionEpisodeFormComponent implements OnInit {

  @Input() transplantId!: number;
  @Output() saved = new EventEmitter<RejectionEpisode>();

  form!: FormGroup;
  isLoading = false;
  error?: string;
  successMessage?: string;

  rejectionTypes = Object.values(RejectionType);
  severities = Object.values(RejectionSeverity);
  statuses = Object.values(RejectionStatus);

  constructor(
    private fb: FormBuilder,
    private rejectionService: RejectionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transplantId: [this.transplantId, Validators.required],
      startDate: ['', Validators.required],
      rejectionType: ['', Validators.required],
      severity: ['', Validators.required],
      creatinineIncrease: ['', [Validators.required, Validators.min(0)]],
      gfrAtRejection: ['', [Validators.required, Validators.min(0)]],
      treatment: ['', Validators.required],
      status: [RejectionStatus.SUSPECTED, Validators.required],
      biopsyId: [null]
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
    if (c.errors['min']) return 'Value must be positive';
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const dto: RejectionEpisodeDTO = {
      ...this.form.value,
      startDate: new Date(this.form.value.startDate).toISOString()
    };

    this.rejectionService.create(dto).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.successMessage = 'Rejection episode recorded successfully.';
        this.saved.emit(result);
        this.form.reset({ transplantId: this.transplantId, status: RejectionStatus.SUSPECTED });
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to record rejection episode.';
      }
    });
  }
}