import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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

  constructor(
    private surveillanceProtocolService: SurveillanceProtocolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.transplantId) {
      this.transplantId = +(this.route.snapshot.paramMap.get('transplantId') ?? 0);
    }
    if (this.transplantId) this.loadSurveillanceProtocols();
  }

  loadSurveillanceProtocols(): void {
    this.isLoading = true;
    this.surveillanceProtocolService.getByTransplantId(this.transplantId).subscribe({
      next: (data) => {
        this.surveillanceProtocols = Array.isArray(data) ? data : [data];
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