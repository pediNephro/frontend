import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserResponse } from '../../shared/models/auth.models';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [CommonModule, FormsModule, PageBreadcrumbComponent, ComponentCardComponent],
    templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
    searchTerm = '';
    users: UserResponse[] = [];
    isLoading = false;

    // Modal state
    showDeleteModal = false;
    showDetailsModal = false;
    showArchiveModal = false;
    userToDelete: UserResponse | null = null;
    userToArchive: UserResponse | null = null;
    selectedUser: UserResponse | null = null;

    archiveError = '';

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    isArchived(user: UserResponse): boolean {
        return user.status === 'ARCHIVED';
    }

    // ─── Archive ───────────────────────────────────────────────────────────────

    confirmArchive(user: UserResponse): void {
        this.userToArchive = user;
        this.showArchiveModal = true;
    }

    cancelArchive(): void {
        this.showArchiveModal = false;
        this.userToArchive = null;
    }

    archiveUser(): void {
        if (!this.userToArchive?.id) return;

        this.authService.archiveUser(this.userToArchive.id).subscribe({
            next: (updated) => {
                const index = this.users.findIndex(u => u.id === updated.id);
                if (index !== -1) this.users[index] = updated;
                this.showArchiveModal = false;
                this.userToArchive = null;
            },
            error: (err) => {
                console.error('Error archiving user:', err);
                this.archiveError = 'Failed to update user status.';
                this.showArchiveModal = false;
                this.userToArchive = null;
            }
        });
    }

    // ─── Load / Filter ─────────────────────────────────────────────────────────

    loadUsers(): void {
        this.isLoading = true;
        this.authService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this.isLoading = false;
            }
        });
    }

    get filteredUsers(): UserResponse[] {
        if (!this.searchTerm) return this.users;
        const term = this.searchTerm.toLowerCase();
        return this.users.filter(
            (u) =>
                u.firstName.toLowerCase().includes(term) ||
                u.lastName.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                (u.phoneNumber && u.phoneNumber.includes(term))
        );
    }

    // ─── Details ───────────────────────────────────────────────────────────────

    viewDetails(user: UserResponse) {
        this.selectedUser = user;
        this.showDetailsModal = true;
    }

    closeDetailsModal() {
        this.showDetailsModal = false;
        this.selectedUser = null;
    }

    // ─── Delete ────────────────────────────────────────────────────────────────

    confirmDelete(user: UserResponse) {
        this.userToDelete = user;
        this.showDeleteModal = true;
    }

    cancelDelete() {
        this.showDeleteModal = false;
        this.userToDelete = null;
    }

    deleteUser() {
        if (this.userToDelete?.id) {
            this.authService.deleteUser(this.userToDelete.id).subscribe({
                next: () => {
                    this.users = this.users.filter((u) => u.id !== this.userToDelete!.id);
                    this.showDeleteModal = false;
                    this.userToDelete = null;
                },
                error: (err) => console.error('Error deleting user:', err)
            });
        }
    }

    // ─── Badges ────────────────────────────────────────────────────────────────

    get totalUsers(): number { return this.users.length; }
    get doctorCount(): number { return this.users.filter(u => u.roleName === 'DOCTOR').length; }
    get nurseCount(): number { return this.users.filter(u => u.roleName === 'NURSE').length; }
    get adminCount(): number { return this.users.filter(u => u.roleName === 'ADMIN').length; }
    get activeCount(): number { return this.users.filter(u => u.status === 'ACTIVE').length; }
    get archivedCount(): number { return this.users.filter(u => u.status === 'ARCHIVED').length; }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'ADMIN':  return 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500';
            case 'DOCTOR': return 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-500';
            case 'NURSE':  return 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500';
            default:       return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    }
}