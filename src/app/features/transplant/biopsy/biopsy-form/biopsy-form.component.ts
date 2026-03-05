import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BiopsyService } from '../../../../core/services/transplant/biopsy.service';
import {
  Biopsy,
  BiopsyDTO,
  BiopsyIndication,
  BanffCategory
} from '../../../../core/models/transplant/biopsy.model';

@Component({
  selector: 'app-biopsy-form',
  standalone: true,
  templateUrl: './biopsy-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class BiopsyFormComponent implements OnInit {

  @Input() transplantId!: number;
  @Output() saved = new EventEmitter<Biopsy>();

  form!: FormGroup;
  isLoading = false;
  error?: string;
  successMessage?: string;

  indications = Object.values(BiopsyIndication);
  banffCategories = Object.values(BanffCategory);
  scoreRange = [0, 1, 2, 3];

  constructor(
    private fb: FormBuilder,
    private biopsyService: BiopsyService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transplantId: [this.transplantId, Validators.required],
      biopsyDate: ['', Validators.required],
      indication: ['', Validators.required],
      banffScoreT: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffScoreI: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffScoreG: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffCategory: ['', Validators.required],
      conclusion: ['', Validators.required],
      reportPath: ['']
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
    if (c.errors['min']) return 'Minimum value is 0';
    if (c.errors['max']) return 'Maximum value is 3';
    return 'Invalid value';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.form.patchValue({ reportPath: file.name });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const dto: BiopsyDTO = {
      ...this.form.value,
      biopsyDate: new Date(this.form.value.biopsyDate).toISOString()
    };

    this.biopsyService.create(dto).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.successMessage = 'Biopsy record saved successfully.';
        this.saved.emit(result);
        this.form.reset({ transplantId: this.transplantId });
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Failed to save biopsy record.';
      }
    });
  }
}