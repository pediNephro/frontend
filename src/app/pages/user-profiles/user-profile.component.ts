import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserResponse } from '../../shared/models/auth.models';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, PageBreadcrumbComponent, ComponentCardComponent],
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
    user: UserResponse = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        roleName: '',
        roleId: 0,
        status: ''
    };
    isLoading = false;
    successMessage = '';
    errorMessage = '';

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe({
            next: (data) => {
                this.user = data;
                if (data.profileImageUrl) {
                    this.authService.saveProfileImageUrl(data.profileImageUrl);
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erreur chargement profil:', err);
                this.errorMessage = 'Impossible de charger le profil.';
                this.isLoading = false;
            }
        });
    }

    onUpdateProfile(): void {
        if (!this.user.id) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.updateProfile(this.user.id, this.user).subscribe({
            next: (updated) => {
                this.user = updated;
                // Update localStorage to reflect changes in UI
                localStorage.setItem('user_name', `${updated.firstName} ${updated.lastName}`);
                localStorage.setItem('user_email', updated.email);

                this.successMessage = 'Profil mis à jour avec succès !';
                this.isLoading = false;

                // Reload page or broadcast change if needed, 
                // but for now local change is enough for the component.
            },
            error: (err) => {
                console.error('Erreur mise à jour profil:', err);
                this.errorMessage = 'Erreur lors de la mise à jour du profil.';
                this.isLoading = false;
            }
        });
    }
}
