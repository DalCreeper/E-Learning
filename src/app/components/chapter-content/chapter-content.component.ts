import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Course, Lesson, Chapter, ChapterContent } from '../../models/course.model';
import { NavigationItem } from '../../models/navigation.model';
import { DataService } from '../../services/data.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-chapter-content',
  standalone: true,
  imports: [
    CommonModule, 
    ToolbarComponent, 
    SidebarComponent
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
      [navTitle]="'Content'"
      [disableItemLinks]="true"
      (sidebarClosed)="sidebarOpen = false">
    </app-sidebar>

    <div class="chapter-container" *ngIf="chapter">
      <div class="content-cards">
        <div 
          *ngFor="let content of chapter.content" 
          class="content-card"
          [ngClass]="{'expanded': content.isExpanded}"
          style="background: white; border: 1px solid #ccc; margin: 10px; padding: 20px; border-radius: 8px;">
          
          <div class="card-header" (click)="toggleContent(content)" style="cursor: pointer; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
            <span style="font-weight: bold;">{{ content.title }}</span>
            <span style="float: right;">{{ content.isExpanded ? '▼' : '▶' }}</span>
          </div>

          <div class="card-content" [ngClass]="{'expanded': content.isExpanded}">
            <div *ngIf="content.type === 'text'" class="text-content">
              <p>{{ content.content }}</p>
            </div>
            
            <div *ngIf="content.type === 'video'" class="video-content">
              <p>Video: {{ content.content }}</p>
            </div>
            
            <div class="content-actions" style="margin-top: 15px; text-align: right;">
              <button 
                (click)="downloadPDF(content)"
                style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./chapter-content.component.css']
})
export class ChapterContentComponent implements OnInit, OnDestroy {
  course: Course | undefined;
  lesson: Lesson | undefined;
  chapter: Chapter | undefined;
  navigationItems: NavigationItem[] = [];
  sidebarOpen = false;
  
  private courseId: string = '';
  private lessonId: string = '';
  private chapterId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.lessonId = this.route.snapshot.paramMap.get('lessonId') || '';
    this.chapterId = this.route.snapshot.paramMap.get('chapterId') || '';
    
    if (this.courseId && this.lessonId && this.chapterId) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
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
          this.setupNavigation();
        }
      });

    this.dataService.getChapter(this.courseId, this.lessonId, this.chapterId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(chapter => {
        this.chapter = chapter;
        if (chapter) {
          this.setupNavigation();
        }
      });
  }

  private setupNavigation(): void {
    if (!this.chapter) return;
    
    this.navigationItems = this.chapter.content.map(content => ({
      id: content.id,
      title: content.title,
      route: ``
    }));
  }

  getPageTitle(): string {
    return this.course && this.lesson && this.chapter ? 
      `${this.course.title} - ${this.lesson.title} - ${this.chapter.title}` : 
      'Chapter';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleContent(content: ChapterContent): void {
    content.isExpanded = !content.isExpanded;
  }

  downloadPDF(content: ChapterContent): void {
    console.log(`Downloading PDF: ${content.pdfUrl}`);
    
    this.dataService.updateProgress(
      this.courseId, 
      this.lessonId, 
      this.chapterId, 
      content.id
    );
    
    alert('PDF download started! Progress updated.');
  }
}