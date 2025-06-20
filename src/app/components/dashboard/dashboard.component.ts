import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { NavigationItem } from '../../models/navigation.model';
import { DataService } from '../../services/data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, ToolbarComponent, SidebarComponent],
  template: `
    <app-toolbar 
      title="Dashboard" 
      (toggleSidebar)="toggleSidebar()">
    </app-toolbar>
    
    <app-sidebar
      *ngIf="sidebarOpen"
      [isOpen]="sidebarOpen"
      [navigationItems]="navigationItems"
      [navTitle]="'Courses'"
      (sidebarClosed)="sidebarOpen = false">
    </app-sidebar>
    
    <div class="dashboard-container">
      <div class="courses-grid">
        <mat-card 
          *ngFor="let course of courses$ | async" 
          class="course-card"
          [routerLink]="['/course', course.id]">
          
          <mat-card-content class="course-content">
            <div class="course-icon">
              <mat-icon>{{ course.icon }}</mat-icon>
            </div>
            
            <div class="course-info">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
            </div>
            
            <div class="course-arrow">
              <mat-icon>chevron_right</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  courses$: Observable<Course[]>;
  navigationItems: NavigationItem[] = [];
  sidebarOpen = false;

  constructor(private dataService: DataService) {
    this.courses$ = this.dataService.getCourses();
  }

  ngOnInit(): void {
    this.setupNavigation();
  }

  public setupNavigation(): void {
    this.dataService.getCourses().subscribe(courses => {
      this.navigationItems = courses.map(course => ({
        id: course.id,
        title: course.title,
        route: `/course/${course.id}`
      }));
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}