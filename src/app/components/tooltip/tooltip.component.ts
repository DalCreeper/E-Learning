import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TooltipData } from '../../models/navigation.model';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="tooltip-container" *ngIf="data">
      <div class="tooltip-header">
        <mat-icon class="tooltip-icon">info</mat-icon>
        <span class="tooltip-title">{{ data.title }}</span>
      </div>
      <p class="tooltip-description">{{ data.description }}</p>
      <div class="tooltip-topics">
        <strong>Topics:</strong>
        <ul>
          <li *ngFor="let topic of data.topics">{{ topic }}</li>
        </ul>
      </div>
      <div class="tooltip-progress">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="data.progress"></div>
        </div>
        <span class="progress-text">{{ data.progress }}% Complete</span>
      </div>
    </div>
  `,
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() data: TooltipData | null = null;
}
