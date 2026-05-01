import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Action, ActionService } from './action.service';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './action-list.component.html'
})
export class ActionListComponent implements OnInit {
  actions: Action[] = [];

  constructor(private actionService: ActionService) {}

  ngOnInit(): void {
    this.loadActions();
  }

  loadActions(): void {
    this.actionService.getAllActions().subscribe({
      next: (data: Action[]) => {
        this.actions = data;
      },
      error: (err) => {
        console.error('Erreur chargement actions :', err);
      }
    });
  }

  delete(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this action?')) {
      this.actionService.deleteAction(id).subscribe({
        next: () => this.loadActions(),
        error: (err) => console.error('Erreur suppression :', err)
      });
    }
  }
}
