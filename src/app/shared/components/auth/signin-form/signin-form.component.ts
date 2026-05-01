
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.models';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    RecaptchaModule
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  recaptchaToken = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRecaptchaResolved(token: string | null) {
    this.recaptchaToken = token || '';
  }

  onSignIn() {
    this.errorMessage = '';

    // Validate reCAPTCHA
    if (!this.recaptchaToken) {
      this.errorMessage = 'Veuillez vérifier le reCAPTCHA';
      return;
    }

    this.isLoading = true;

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        console.log('Login successful - Token received:', response.token ? 'Yes' : 'No');
        console.log('Login successful - User:', response.email, '| Role:', response.roleName);

        this.authService.saveSession(response);

        // Fetch profile image after login
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            if (user.profileImageUrl) {
              this.authService.saveProfileImageUrl(user.profileImageUrl);
            }
            this.isLoading = false;
            if (response.roleId === 1) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/patients']);
            }
          },
          error: () => {
            this.isLoading = false;
            if (response.roleId === 1) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/patients']);
            }
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect.';
      }
    });
  }
}
