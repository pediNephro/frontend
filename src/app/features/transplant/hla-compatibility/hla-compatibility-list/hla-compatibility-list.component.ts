import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HlaCompatibilityService } from '../../../../core/services/transplant/hla-compatibility.service';
import { HLACompatibility } from '../../../../core/models/transplant/hla-compatibility.model';

@Component({
  selector: 'app-hla-compatibility-list',
  standalone: true,
  templateUrl: './hla-compatibility-list.component.html',
  imports: [CommonModule, RouterModule]
})
export class HlaCompatibilityListComponent implements OnInit {
  @Input() transplantId!: number;

  hlaCompatibilities: HLACompatibility[] = [];
  isLoading = true;
  error?: string;

  constructor(private hlaCompatibilityService: HlaCompatibilityService) {}

  ngOnInit(): void {
    this.loadHlaCompatibilities();
  }

  loadHlaCompatibilities(): void {
    this.isLoading = true;
    this.hlaCompatibilityService.getByTransplant(this.transplantId).subscribe({
      next: (data) => {
        this.hlaCompatibilities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load HLA compatibilities';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}