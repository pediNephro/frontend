import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { AlertNotificationService } from '../../../../core/services/monitoring/alert-notification.service';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent]
})
export class NotificationDropdownComponent {
  isOpen = false;

  constructor(public alertNotification: AlertNotificationService) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.alertNotification.refresh();
    }
  }

  closeDropdown() {
    this.isOpen = false;
  }
}