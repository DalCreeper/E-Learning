import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseViewComponent } from './course-view.component';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('CourseViewComponent', () => {
  let component: CourseViewComponent;
  let fixture: ComponentFixture<CourseViewComponent>;
  let dataService: DataService;

  const mockCourse = {
    id: 'c1',
    title: 'Course 1',
    lessons: [
      {
        id: 'l1',
        title: 'Lesson 1',
        description: 'Lesson 1 desc',
        topics: [],
        progress: 0,
        position: { x: 0, y: 0 },
        connections: [],
        isCompleted: false
      },
      {
        id: 'l2',
        title: 'Lesson 2',
        description: 'Lesson 2 desc',
        topics: [],
        progress: 0,
        position: { x: 0, y: 0 },
        connections: [],
        isCompleted: false
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseViewComponent],
      providers: [
        {
          provide: DataService,
          useValue: {
            getCourse: () => of(mockCourse)
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'courseId') return 'c1';
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

    fixture = TestBed.createComponent(CourseViewComponent);
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
    component['course'] = mockCourse as any;
    (component as any).setupNavigation();
    fixture.detectChanges();
    expect(component.navigationItems.length).toBe(2);
    expect(component.navigationItems[0].title).toBe('Lesson 1');
  });

  it('should open and close the sidebar', () => {
    expect(component.sidebarOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeTrue();
    component.toggleSidebar();
    expect(component.sidebarOpen).toBeFalse();
  });

  it('should render lesson circles', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.lesson-circle').length).toBe(2);
  });

  it('should call router.navigate when navigateToLesson is called', () => {
    const router = TestBed.inject(Router);
    component['course'] = mockCourse as any;
    component.navigateToLesson('l1');
    expect(router.navigate).toHaveBeenCalledWith(['/course', 'c1', 'lesson', 'l1']);
  });

  it('should handle course with no lessons', () => {
    component['course'] = { id: 'c2', title: 'Empty Course', lessons: [] } as any;
    (component as any).setupNavigation();
    fixture.detectChanges();
    expect(component.navigationItems.length).toBe(0);
  });

  it('should not call router.navigate if course is missing', () => {
    const router = TestBed.inject(Router);
    component['course'] = undefined as any;
    component.navigateToLesson('l1');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not call router.navigate if lessonId is missing', () => {
    const router = TestBed.inject(Router);
    component['course'] = mockCourse as any;
    component.navigateToLesson(undefined as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});