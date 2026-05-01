import { Component, OnInit, OnDestroy } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent]
})
export class UserDropdownComponent implements OnInit, OnDestroy {
  isOpen = false;
  userName = '';
  userEmail = '';
  userProfileImage = '/images/user/owner.png';
  private imageSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'User';
    this.userEmail = localStorage.getItem('user_email') || '';

    // Subscribe to profile image changes reactively
    this.imageSub = this.authService.getProfileImage$().subscribe(url => {
      this.userProfileImage = url;
    });

    // If no image stored yet, fetch from API
    if (!this.authService.getProfileImageUrl()) {
      this.loadProfileImage();
    }
  }

  ngOnDestroy(): void {
    if (this.imageSub) {
      this.imageSub.unsubscribe();
    }
  }

  private loadProfileImage(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.profileImageUrl) {
          this.authService.saveProfileImageUrl(user.profileImageUrl);
        }
      },
      error: () => {}
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  onSignOut() {
    this.authService.removeSession();
    this.closeDropdown();
    this.router.navigate(['/signin']);
  }
}