import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-reset-password-form',
    imports: [
        CommonModule,
        LabelComponent,
        ButtonComponent,
        InputFieldComponent,
        RouterModule,
        FormsModule
    ],
    templateUrl: './reset-password-form.component.html',
    styles: ``
})
export class ResetPasswordFormComponent {

    email = '';
    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onResetPassword() {
        this.errorMessage = '';
        this.successMessage = '';

        if (!this.email || !this.email.trim()) {
            this.errorMessage = 'Please enter your email address.';
            return;
        }

        this.isLoading = true;

        this.authService.requestPasswordReset(this.email).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successMessage = response?.message || 'A password reset email has been sent to your address. Please check your inbox.';
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Password reset error:', err);
                this.errorMessage = err.error?.error || err.error?.message || 'An error occurred. Please check your email and try again.';
            }
        });
    }
}
