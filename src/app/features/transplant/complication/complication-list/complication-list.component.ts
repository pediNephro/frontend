import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComplicationService } from '../../../../core/services/transplant/complication.service';
import { Complication } from '../../../../core/models/transplant/complication.model';

@Component({
  selector: 'app-complication-list',
  standalone: true,
  templateUrl: './complication-list.component.html',
  imports: [CommonModule, RouterModule]
})
export class ComplicationListComponent implements OnInit {
  @Input() transplantId!: number;

  complications: Complication[] = [];
  isLoading = true;
  error?: string;

  constructor(private complicationService: ComplicationService) {}

  ngOnInit(): void {
    this.loadComplications();
  }

  loadComplications(): void {
    this.isLoading = true;
    this.complicationService.getByTransplant(this.transplantId).subscribe({
      next: (data) => {
        this.complications = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load complications';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}