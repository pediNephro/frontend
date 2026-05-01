// File: src/app/pages/medical-notes/note-form/note-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MedicalNote, MedicalNoteCreateDTO } from '../../../../core/models/monitoring';
import { MedicalNoteService } from '../../../../core/services/monitoring/medical-note.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent implements OnInit {
  noteForm!: FormGroup;
  isEditMode = false;
  noteId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private noteService: MedicalNoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.noteForm = this.fb.group({
      authorId: ['', [Validators.required, Validators.min(1)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      vitalSignId: ['', [Validators.min(1)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.noteId = +id;
      this.loadNote();
    }
  }

  loadNote(): void {
    if (!this.noteId) return;

    this.loading = true;
    this.error = null;

    this.noteService.getById(this.noteId).subscribe({
      next: (data) => {
        this.populateForm(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load note data';
        this.loading = false;
        console.error('Error loading note:', err);
      }
    });
  }

  populateForm(note: MedicalNote): void {
    this.noteForm.patchValue({
      authorId: note.authorId,
      content: note.content,
      vitalSignId: note.vitalSignId || ''
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) {
      this.markFormGroupTouched(this.noteForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.noteForm.value;
      const now = new Date();

    const dto: any = {
      authorId: formValue.authorId,
      content: formValue.content.trim(),
      creationDate: now.toISOString().slice(0, 19) // removes milliseconds + Z
      };
    // Add vitalSignId only if provided
if (formValue.vitalSignId && +formValue.vitalSignId > 0) {
 dto.vitalSign = {
    id: Number(formValue.vitalSignId)
  };}

    if (this.isEditMode && this.noteId) {
      this.updateNote(dto);
    } else {
      this.createNote(dto);
    }
  }

  createNote(dto: MedicalNoteCreateDTO): void {
    this.noteService.create(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/medical-notes']);
      },
      error: (err) => {
        this.error = 'Failed to create note';
        this.submitting = false;
        console.error('Create error:', err);
      }
    });
  }

  updateNote(dto: Partial<MedicalNote>): void {
    if (!this.noteId) return;

    this.noteService.update(this.noteId, dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/medical-notes']);
      },
      error: (err) => {
        this.error = 'Failed to update note';
        this.submitting = false;
        console.error('Update error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/medical-notes']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.noteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.noteForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'This field is required';
    }
    if (field?.errors?.['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field?.errors?.['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
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

  get contentLength(): number {
    return this.noteForm.get('content')?.value?.length || 0;
  }

  get remainingChars(): number {
    return 5000 - this.contentLength;
  }
}