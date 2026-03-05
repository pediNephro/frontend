import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HlaCompatibilityService } from '../../../../core/services/transplant/hla-compatibility.service';
import {
  HLACompatibility,
  HLACompatibilityDTO,
  CrossMatchResult
} from '../../../../core/models/transplant/hla-compatibility.model';

@Component({
  selector: 'app-hla-compatibility-form',
  standalone: true,
  templateUrl: './hla-compatibility-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class HlaCompatibilityFormComponent implements OnInit {

  @Input() transplantId!: number;
  @Output() saved = new EventEmitter<HLACompatibility>();

  form!: FormGroup;
  isLoading = false;
  error?: string;
  successMessage?: string;

  crossMatchResults = Object.values(CrossMatchResult);

  constructor(
    private fb: FormBuilder,
    private hlaCompatibilityService: HlaCompatibilityService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transplantId: [this.transplantId, Validators.required],
      donorHlaA: ['', Validators.required],
      donorHlaB: ['', Validators.required],
      donorHlaDr: ['', Validators.required],
      recipientHlaA: ['', Validators.required],
      recipientHlaB: ['', Validators.required],
      recipientHlaDr: ['', Validators.required],
      crossMatchResult: ['', Validators.required]
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

    const dto: HLACompatibilityDTO = this.form.value;

    this.hlaCompatibilityService.create(dto).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.successMessage = 'HLA compatibility record saved successfully.';
        this.saved.emit(result);
        this.form.reset({ transplantId: this.transplantId });
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to save HLA compatibility record.';
      }
    });
  }
}