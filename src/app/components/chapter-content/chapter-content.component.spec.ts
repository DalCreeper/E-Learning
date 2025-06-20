import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterContentComponent } from './chapter-content.component';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ChapterContentComponent', () => {
  let component: ChapterContentComponent;
  let fixture: ComponentFixture<ChapterContentComponent>;
  let dataService: DataService;

  const mockChapter = {
    id: '1',
    title: 'Chapter 1',
    description: 'Mock chapter description',
    progress: 0,
    position: { x: 0, y: 0 },
    connections: [],
    isCompleted: false,
    content: [
      { id: 'c1', title: 'Content 1', type: 'text' as 'text', content: 'Testo', pdfUrl: '', isExpanded: false, isViewed: false },
      { id: 'c2', title: 'Content 2', type: 'text' as 'text', content: 'Altro', pdfUrl: '', isExpanded: false, isViewed: false }
    ]
  };
  const mockLesson = { id: 'l1', title: 'Lesson 1', chapters: [mockChapter] };
  const mockCourse = { id: 'c1', title: 'Course 1', lessons: [mockLesson] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterContentComponent],
      providers: [
        {
          provide: DataService,
          useValue: {
            getCourse: () => of(mockCourse),
            getLesson: () => of(mockLesson),
            getChapter: () => of(mockChapter),
            updateProgress: () => {}
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'courseId') return 'c1';
                  if (key === 'lessonId') return 'l1';
                  if (key === 'chapterId') return '1';
                  return null;
                }
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterContentComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-toolbar')).toBeTruthy();
  });

  it('should populate navigationItems after setupNavigation', () => {
    component['chapter'] = mockChapter;
    component['setupNavigation']();
    fixture.detectChanges();
    expect(component.navigationItems.length).toBe(2);
    expect(component.navigationItems[0].title).toBe('Content 1');
  });

  it('should open and close the sidebar', () => {
    expect(component.sidebarOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeTrue();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeFalse();
  });

  it('should render content cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.content-card').length).toBe(2);
  });

  it('should toggle content expansion', () => {
    const content = mockChapter.content[0];
    expect(content.isExpanded).toBeFalse();
    component.toggleContent(content);
    expect(content.isExpanded).toBeTrue();
    component.toggleContent(content);
    expect(content.isExpanded).toBeFalse();
  });

  it('should call updateProgress when downloading PDF', () => {
    const spy = spyOn(dataService, 'updateProgress');
    const content = mockChapter.content[0];
    component.downloadPDF(content);
    expect(spy).toHaveBeenCalled();
  });
});