import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportScheduleService } from './report-schedule.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './schedule-list.component.html'
})
export class ScheduleListComponent implements OnInit {
  schedules: any[] = [];

  constructor(private service: ReportScheduleService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.service.getSchedules().subscribe({
      next: (data) => this.schedules = data,
      error: (err) => console.error(err)
    });
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.service.deleteSchedule(id).subscribe(() => {
        this.loadSchedules();
      });
    }
  }
}
