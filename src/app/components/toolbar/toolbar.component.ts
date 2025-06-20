import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar class="toolbar">
      <div class="toolbar-left">
        <button mat-icon-button (click)="toggleSidebar.emit()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="page-title">{{ title }}</span>
      </div>
      <div class="toolbar-right">
        <span class="logo">E-Learning</span>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() title: string = '';
  @Output() toggleSidebar = new EventEmitter<void>();
}
