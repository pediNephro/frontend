import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportTemplateService } from './report-template.service';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template-list.component.html'
})
export class TemplateListComponent implements OnInit {
  templates: any[] = [];

  constructor(private service: ReportTemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.service.getAll().subscribe({
      next: data => this.templates = data,
      error: err => console.error(err)
    });
  }

  delete(id: number): void {
    if (confirm('Delete this template?')) {
      this.service.delete(id).subscribe(() => {
        this.loadTemplates();
      });
    }
  }
}
