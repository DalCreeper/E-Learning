import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../../models/navigation.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <div class="sidenav-backdrop" (click)="sidebarClosed.emit()"></div>
      <mat-sidenav 
        #sidenav 
        [opened]="isOpen" 
        mode="over" 
        class="sidenav"
        (closedStart)="sidebarClosed.emit()">
        
        <div class="sidenav-header">
          <span class="nav-title-header">{{ navTitle }}</span>
          <button mat-icon-button (click)="sidenav.close()" class="close-button">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="sidenav-content">
          <div class="nav-list-container">
            <div class="nav-list-container">
              <div *ngFor="let item of navigationItems" 
                  class="nav-item"
                  [routerLink]="!disableItemLinks ? item.route : null"
                  [class.disabled]="disableItemLinks"
                  (click)="!disableItemLinks && sidenav.close()">
                <mat-icon class="nav-icon-left">{{ getItemIcon(item) }}</mat-icon>
                <span class="nav-title-text">{{ item.title }}</span>
                <span class="spacer"></span>
                <ng-container *ngIf="!disableItemLinks">
                  <mat-icon class="nav-icon-right">chevron_right</mat-icon>
                </ng-container>
              </div>
            </div>
          </div>
        </div>

        <div class="sidenav-footer">
          <button 
            mat-raised-button 
            color="primary" 
            routerLink="/dashboard"
            (click)="sidenav.close()"
            class="dashboard-button">
            <mat-icon>home</mat-icon>
            Back to dashboard
          </button>
        </div>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Input() navigationItems: NavigationItem[] = [];
  @Input() navTitle: string = '';
  @Output() sidebarClosed = new EventEmitter<void>();
  @Input() disableItemLinks: boolean = false;

  getItemIcon(item: NavigationItem): string {
    if (item.route.includes('/course/') && !item.route.includes('/lesson/')) {
      return 'school';
    } else if (item.route.includes('/lesson/') && !item.route.includes('/chapter/')) {
      return 'play_circle_outline';
    } else if (item.route.includes('/chapter/')) {
      return 'article';
    }
    return 'folder';
  }
}