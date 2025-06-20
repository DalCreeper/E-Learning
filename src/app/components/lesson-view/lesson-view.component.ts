import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Course, Lesson, Chapter } from '../../models/course.model';
import { NavigationItem } from '../../models/navigation.model';
import { DataService } from '../../services/data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ToolbarComponent, 
    SidebarComponent, 
    ProgressBarComponent
  ],
  template: `
    <app-toolbar 
      [title]="getPageTitle()" 
      (toggleSidebar)="toggleSidebar()">
    </app-toolbar>
    
    <app-sidebar
      *ngIf="sidebarOpen"
      [isOpen]="sidebarOpen"
      [navigationItems]="navigationItems"
      [navTitle]="'Chapters'"
      (sidebarClosed)="sidebarOpen = false">
    </app-sidebar>

    <div class="lesson-container" *ngIf="lesson" #lessonContainer>
      <div class="chapters-graph">
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
        <!-- Chapter circles -->
        <div 
          *ngFor="let chapter of lesson.chapters"
          class="chapter-circle"
          [style.left.px]="chapter.position.x"
          [style.top.px]="chapter.position.y"
          [class.completed]="chapter.isCompleted"
          [class.in-progress]="chapter.progress > 0 && chapter.progress < 100"
          [routerLink]="['/course', courseId, 'lesson', lessonId, 'chapter', chapter.id]">
          <app-progress-bar
            [progress]="chapter.progress"
            [title]="chapter.title"
            baseColor="#5F9EA0"
            activeColor="#6750A4"
            inactiveColor="#E8DEF8"
            completedColor="#A4A3E8">
          </app-progress-bar>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lesson-view.component.css']
})
export class LessonViewComponent implements OnInit, OnDestroy, AfterViewInit {
  course: Course | undefined;
  lesson: Lesson | undefined;
  navigationItems: NavigationItem[] = [];
  sidebarOpen = false;
  connections: any[] = [];
  
  courseId: string = '';
  lessonId: string = '';
  private destroy$ = new Subject<void>();

   @ViewChild('lessonContainer') lessonContainerRef!: ElementRef<HTMLDivElement>;
    lessonContainerHeight = 0;

    ngAfterViewInit(): void {
      if (this.lessonContainerRef) {
        this.lessonContainerHeight = this.lessonContainerRef.nativeElement.offsetHeight;
        this.updateSvgSize();
        this.cdr.detectChanges();
      }
    }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.lessonId = this.route.snapshot.paramMap.get('lessonId') || '';
    
    if (this.courseId && this.lessonId) {
      this.dataService.getCourse(this.courseId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(course => {
          this.course = course;
        });

      this.dataService.getLesson(this.courseId, this.lessonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(lesson => {
        this.lesson = lesson;
        if (lesson) {
          const positions = this.generateZigZagPositions(
            lesson.chapters.length,
            100,  // startX
            100,  // startY
            220,  // stepX
            180   // stepY
          );
          lesson.chapters.forEach((chapter, i) => {
            chapter.position = positions[i];
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
    if (!this.lesson) return;
    
    this.navigationItems = this.lesson.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      route: `/course/${this.courseId}/lesson/${this.lessonId}/chapter/${chapter.id}`
    }));
  }

  svgWidth = 0;
  svgHeight = 0;

  private updateSvgSize() {
    if (!this.lesson?.chapters?.length) return;
    const margin = 220;
    const maxX = Math.max(...this.lesson.chapters.map(l => l.position.x)) + margin;
    const maxY = Math.max(...this.lesson.chapters.map(l => l.position.y)) + margin;
    this.svgWidth = maxX;
    this.svgHeight = Math.min(Math.max(this.lessonContainerHeight || 0, maxY), this.lessonContainerHeight || 0);
  }

  private calculateConnections(): void {
    if (!this.lesson) return;
    
    this.connections = [];
    this.lesson.chapters.forEach(chapter => {
      chapter.connections.forEach(connectionId => {
        const targetChapter = this.lesson!.chapters.find(c => c.id === connectionId);
        if (targetChapter) {
          this.connections.push({
            x1: chapter.position.x + 50,
            y1: chapter.position.y + 50,
            x2: targetChapter.position.x + 50,
            y2: targetChapter.position.y + 50
          });
        }
      });
    });
  }

  getPageTitle(): string {
    return this.course && this.lesson ? 
      `${this.course.title} - ${this.lesson.title}` : 
      'Lesson';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateToChapter(chapterId: string): void {
    this.router.navigate(['/course', this.courseId, 'lesson', this.lessonId, 'chapter', chapterId]);
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