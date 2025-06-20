import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Course, Lesson } from '../../models/course.model';
import { NavigationItem, TooltipData } from '../../models/navigation.model';
import { DataService } from '../../services/data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ToolbarComponent, 
    SidebarComponent, 
    ProgressBarComponent, 
    TooltipComponent
  ],
  template: `
    <app-toolbar 
      [title]="course?.title || 'Course'" 
      (toggleSidebar)="toggleSidebar()">
    </app-toolbar>
    
    <app-sidebar 
      *ngIf="sidebarOpen"
      [isOpen]="sidebarOpen"
      [navigationItems]="navigationItems"
      [navTitle]="'Lessons'"
      (sidebarClosed)="sidebarOpen = false">
    </app-sidebar>

    <div class="course-container" *ngIf="course" #courseContainer>
      <div class="lessons-graph">
        <!-- Connections -->
        <svg class="connections-svg"
          [attr.width]="svgWidth"
          [attr.height]="svgHeight"
          [style.width.px]="svgWidth"
          [style.height.px]="svgHeight">
          <line
            *ngFor="let conn of connections"
            [attr.x1]="conn.x1"
            [attr.y1]="conn.y1"
            [attr.x2]="conn.x2"
            [attr.y2]="conn.y2"
            stroke="#222B4D"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.7"
          />
        </svg>
        <!-- Lesson circles -->
        <div 
          *ngFor="let lesson of course.lessons"
          class="lesson-circle"
          [style.left.px]="lesson.position.x"
          [style.top.px]="lesson.position.y"
          [class.completed]="lesson.isCompleted"
          [routerLink]="['/course', course.id, 'lesson', lesson.id]"
          (mouseenter)="showTooltip($event, lesson)"
          (mousemove)="showTooltip($event, lesson)"
          (mouseleave)="hideTooltip()">
          <app-progress-bar
            [progress]="lesson.progress"
            [title]="lesson.title"
            baseColor="#CCAF12"
            activeColor="#008080"
            inactiveColor="#7C9D3D"
            completedColor="#008080">
          </app-progress-bar>
        </div>
      </div>
      <div 
        *ngIf="tooltipVisible && tooltipData"
        class="tooltip-wrapper"
        [style.left.px]="tooltipPosition.x"
        [style.top.px]="tooltipPosition.y">
        <app-tooltip [data]="tooltipData"></app-tooltip>
      </div>
    </div>
  `,
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent implements OnInit, OnDestroy, AfterViewInit {
  course: Course | undefined;
  navigationItems: NavigationItem[] = [];
  sidebarOpen = false;
  tooltipVisible = false;
  tooltipData: TooltipData | null = null;
  tooltipPosition = { x: 0, y: 0 };
  connections: any[] = [];
  
  private destroy$ = new Subject<void>();

  @ViewChild('courseContainer') courseContainerRef!: ElementRef<HTMLDivElement>;
  courseContainerHeight = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.courseContainerRef) {
      this.courseContainerHeight = this.courseContainerRef.nativeElement.offsetHeight;
      this.updateSvgSize();
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId) {
    this.dataService.getCourse(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(course => {
        this.course = course;
        if (course) {
          const positions = this.generateZigZagPositions(
            course.lessons.length,
            100,  // startX
            100,  // startY
            220,  // stepX
            180   // stepY
          );
          course.lessons.forEach((lesson, i) => {
            lesson.position = positions[i];
          });
          setTimeout(() => {
            this.updateSvgSize();
            this.calculateConnections();
          });
          this.setupNavigation();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupNavigation(): void {
    if (!this.course) return;
    
    this.navigationItems = this.course.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      route: `/course/${this.course!.id}/lesson/${lesson.id}`
    }));
  }

  private calculateConnections(): void {
    if (!this.course) return;
    
    this.connections = [];
    this.course.lessons.forEach(lesson => {
      lesson.connections.forEach(connectionId => {
        const targetLesson = this.course!.lessons.find(l => l.id === connectionId);
        if (targetLesson) {
          this.connections.push({
            x1: lesson.position.x + 50,
            y1: lesson.position.y + 50,
            x2: targetLesson.position.x + 50,
            y2: targetLesson.position.y + 50
          });
        }
      });
    });
  }

  svgWidth = 0;
  svgHeight = 0;

  private updateSvgSize() {
    if (!this.course?.lessons?.length) return;
    const margin = 220;
    const maxX = Math.max(...this.course.lessons.map(l => l.position.x)) + margin;
    const maxY = Math.max(...this.course.lessons.map(l => l.position.y)) + margin;
    this.svgWidth = maxX;
    this.svgHeight = Math.min(Math.max(this.courseContainerHeight || 0, maxY), this.courseContainerHeight || 0);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateToLesson(lessonId: string): void {
    if (!this.course || !lessonId) {
      return;
    }
    this.router.navigate(['/course', this.course.id, 'lesson', lessonId]);
  }

  showTooltip(event: MouseEvent, lesson: Lesson): void {
    this.tooltipData = {
      title: lesson.title,
      description: lesson.description,
      topics: lesson.topics,
      progress: lesson.progress
    };

    const tooltipWidth = 320;
    const offsetX = 35;
    const offsetY = 70;

    let x = event.pageX + offsetX;
    let y = event.clientY - offsetY;

    const windowWidth = window.innerWidth + window.scrollX;

    if (x + tooltipWidth > windowWidth) {
      x = event.pageX - tooltipWidth + (offsetX * 3);
    }

    if (x < window.scrollX) {
      x = window.scrollX + 5;
    }

    this.tooltipPosition = { x, y };
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSvgSize();
    this.calculateConnections();
  }

  private generateZigZagPositions(
    count: number,
    startX = 100,
    startY = 100,
    stepX = 220,
    stepY = 180
  ): { x: number, y: number }[] {
    const positions: { x: number, y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const y = (i % 2 === 0) ? startY : startY + stepY;
      positions.push({ x: startX + i * stepX, y });
    }
    return positions;
  }
}