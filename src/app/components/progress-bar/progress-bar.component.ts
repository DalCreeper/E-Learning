import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="circular-progress" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="60"
        [attr.fill]="progress === 100 ? completedColor : baseColor"
      />
      <ng-container *ngIf="progress < 100">
        <circle
          class="progress-bg"
          cx="60"
          cy="60"
          r="50"
          fill="none"
          [attr.stroke]="inactiveColor"
          stroke-width="8"
        />
        <circle
          class="progress-bar"
          cx="60"
          cy="60"
          r="50"
          fill="none"
          [attr.stroke]="activeColor"
          stroke-width="8"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="circumference - (progress / 100) * circumference"
          stroke-linecap="round"
          style="transition: stroke-dashoffset 0.4s;"
        />
      </ng-container>
      <text
        x="60"
        y="66"
        text-anchor="middle"
        fill="#fff"
        font-size="16"
        font-weight="bold"
        alignment-baseline="middle"
        dominant-baseline="middle"
      >
        <tspan x="60" dy="-0.5em">{{ titleLine1 }}</tspan>
        <tspan x="60" dy="1.2em">{{ titleLine2 }}</tspan>
      </text>
    </svg>
  `,
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() title: string = '';
  @Input() baseColor: string = '#CCAF12';
  @Input() activeColor: string = '#008080';
  @Input() inactiveColor: string = '#7C9D3D';
  @Input() completedColor: string = '#008080';

  readonly radius = 50;
  readonly circumference = 2 * Math.PI * this.radius;

  get titleLine1() {
    return this.title.split(' ')[0] || '';
  }
  get titleLine2() {
    return this.title.split(' ').slice(1).join(' ') || '';
  }
}