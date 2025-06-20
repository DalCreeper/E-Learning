import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonViewComponent } from './lesson-view.component';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('LessonViewComponent', () => {
  let component: LessonViewComponent;
  let fixture: ComponentFixture<LessonViewComponent>;
  let dataService: DataService;

  const mockLesson = {
    id: 'l1',
    title: 'Lesson 1',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1',
        description: 'desc',
        progress: 0,
        position: { x: 0, y: 0 },
        connections: [],
        isCompleted: false,
        content: []
      },
      {
        id: 'c2',
        title: 'Chapter 2',
        description: 'desc',
        progress: 0,
        position: { x: 0, y: 0 },
        connections: [],
        isCompleted: false,
        content: []
      }
    ]
  };
  const mockCourse = { id: 'course1', title: 'Course 1', lessons: [mockLesson] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonViewComponent],
      providers: [
        {
          provide: DataService,
          useValue: {
            getCourse: () => of(mockCourse),
            getLesson: () => of(mockLesson)
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'courseId') return 'course1';
                  if (key === 'lessonId') return 'l1';
                  return null;
                }
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonViewComponent);
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
    component['lesson'] = mockLesson as any;
    (component as any).setupNavigation();
    fixture.detectChanges();
    expect(component.navigationItems.length).toBe(2);
    expect(component.navigationItems[0].title).toBe('Chapter 1');
  });

  it('should open and close the sidebar', () => {
    expect(component.sidebarOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeTrue();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeFalse();
  });

  it('should render chapter circles', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.chapter-circle').length).toBe(2);
  });

  it('should call router.navigate when navigateToChapter is called', () => {
    const router = TestBed.inject(Router);
    component['lesson'] = mockLesson as any;
    component['courseId'] = 'course1';
    component['lessonId'] = 'l1';
    component.navigateToChapter('c1');
    expect(router.navigate).toHaveBeenCalledWith(['/course', 'course1', 'lesson', 'l1', 'chapter', 'c1']);
  });
});