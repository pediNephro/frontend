import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.models';

@Component({
  selector: 'app-signup-form',
  imports: [
    CommonModule,
    LabelComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {

  showPassword = false;

  fname = '';
  lname = '';
  email = '';
  password = '';
  phoneNumber = '';
  roleName = '';
  profileImage: File | null = null;
  errorMessage = '';
  isLoading = false;

  fieldErrors: { [key: string]: string } = {};
  touchedFields: { [key: string]: boolean } = {};

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly phoneRegex = /^\d{8}$/;
  private readonly nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // --- Real-time field validation ---

  validateField(field: string): void {
    this.touchedFields[field] = true;
    delete this.fieldErrors[field];

    switch (field) {
      case 'fname':
        if (!this.fname.trim()) {
          this.fieldErrors['fname'] = 'First name is required.';
        } else if (this.fname.trim().length < 2) {
          this.fieldErrors['fname'] = 'Must be at least 2 characters.';
        } else if (!this.nameRegex.test(this.fname.trim())) {
          this.fieldErrors['fname'] = 'Must contain only letters.';
        }
        break;

      case 'lname':
        if (!this.lname.trim()) {
          this.fieldErrors['lname'] = 'Last name is required.';
        } else if (this.lname.trim().length < 2) {
          this.fieldErrors['lname'] = 'Must be at least 2 characters.';
        } else if (!this.nameRegex.test(this.lname.trim())) {
          this.fieldErrors['lname'] = 'Must contain only letters.';
        }
        break;

      case 'email':
        if (!this.email.trim()) {
          this.fieldErrors['email'] = 'Email is required.';
        } else if (!this.emailRegex.test(this.email)) {
          this.fieldErrors['email'] = 'Invalid email format (e.g. user@example.com).';
        }
        break;

      case 'phoneNumber':
        if (!this.phoneNumber.trim()) {
          this.fieldErrors['phoneNumber'] = 'Phone number is required.';
        } else if (!this.phoneRegex.test(this.phoneNumber)) {
          this.fieldErrors['phoneNumber'] = 'Must contain exactly 8 digits.';
        }
        break;

      case 'password':
        if (!this.password.trim()) {
          this.fieldErrors['password'] = 'Password is required.';
        } else if (this.password.length < 8) {
          this.fieldErrors['password'] = 'Must be at least 8 characters.';
        } else if (!/[A-Z]/.test(this.password)) {
          this.fieldErrors['password'] = 'Must contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(this.password)) {
          this.fieldErrors['password'] = 'Must contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(this.password)) {
          this.fieldErrors['password'] = 'Must contain at least one digit.';
        }
        break;

      case 'roleName':
        if (!this.roleName) {
          this.fieldErrors['roleName'] = 'Role is required.';
        }
        break;

      case 'profileImage':
        if (!this.profileImage) {
          this.fieldErrors['profileImage'] = 'Profile photo is required.';
        } else {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(this.profileImage.type)) {
            this.fieldErrors['profileImage'] = 'Only JPG, PNG or GIF files are allowed.';
          } else if (this.profileImage.size > 5 * 1024 * 1024) {
            this.fieldErrors['profileImage'] = 'File size must not exceed 5MB.';
          }
        }
        break;
    }
  }

  isFieldValid(field: string): boolean {
    if (!this.touchedFields[field] || this.fieldErrors[field]) return false;
    // Only show green for profileImage when a valid file is actually selected
    if (field === 'profileImage') return !!this.profileImage;
    return true;
  }

  isFieldInvalid(field: string): boolean {
    return this.touchedFields[field] && !!this.fieldErrors[field];
  }

  // Password strength
  get passwordStrength(): number {
    let strength = 0;
    if (this.password.length >= 8) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[a-z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^a-zA-Z0-9]/.test(this.password)) strength++;
    return strength;
  }

  get passwordStrengthLabel(): string {
    if (!this.password) return '';
    if (this.passwordStrength <= 2) return 'Weak';
    if (this.passwordStrength <= 3) return 'Medium';
    if (this.passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  }

  get passwordStrengthColor(): string {
    if (this.passwordStrength <= 2) return 'bg-error-500';
    if (this.passwordStrength <= 3) return 'bg-warning-500';
    if (this.passwordStrength <= 4) return 'bg-success-400';
    return 'bg-success-500';
  }

  private validateAll(): boolean {
    const fields = ['fname', 'lname', 'email', 'phoneNumber', 'password', 'roleName', 'profileImage'];
    fields.forEach(f => this.validateField(f));

    return Object.keys(this.fieldErrors).length === 0;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImage = input.files[0];
      this.validateField('profileImage');
    }
  }

  onSignUp() {
    this.errorMessage = '';
    if (!this.validateAll()) return;
    this.isLoading = true;

    const request: RegisterRequest = {
      firstName: this.fname,
      lastName: this.lname,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      roleName: this.roleName
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.authService.saveSession(response);

        if (this.profileImage && response.id) {
          this.authService.uploadProfileImage(response.id, this.profileImage).subscribe({
            next: (uploadResponse) => {
              if (uploadResponse?.profileImageUrl) {
                this.authService.saveProfileImageUrl(uploadResponse.profileImageUrl);
              }
              this.isLoading = false;
              this.navigateByRole(response.roleId);
            },
            error: () => {
              this.isLoading = false;
              this.navigateByRole(response.roleId);
            }
          });
        } else {
          this.isLoading = false;
          this.navigateByRole(response.roleId);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred during registration.';
      }
    });
  }

  private navigateByRole(roleId: number): void {
    if (roleId === 1) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/patients']);
    }
  }
}
