import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveillanceProtocolService } from '../../../../core/services/transplant/surveillance-protocol.service';
import { SurveillanceProtocol } from '../../../../core/models/transplant/surveillance-protocol.model';

@Component({
  selector: 'app-surveillance-protocol-list',
  standalone: true,
  templateUrl: './surveillance-protocol-list.component.html',
  imports: [CommonModule, RouterModule]
})
export class SurveillanceProtocolListComponent implements OnInit {
  @Input() transplantId!: number;

  surveillanceProtocols: SurveillanceProtocol[] = [];
  isLoading = true;
  error?: string;

  constructor(private surveillanceProtocolService: SurveillanceProtocolService) {}

  ngOnInit(): void {
    this.loadSurveillanceProtocols();
  }

  loadSurveillanceProtocols(): void {
    this.isLoading = true;
    this.surveillanceProtocolService.getByTransplant(this.transplantId).subscribe({
      next: (data) => {
        this.surveillanceProtocols = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load surveillance protocols';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}