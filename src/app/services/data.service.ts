import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Lesson, Chapter, ChapterContent } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Course 1',
        description: 'Course detailed description',
        icon: 'school',
        progress: 25,
        lessons: [
          {
            id: '1',
            title: 'Lesson 1',
            description: 'Introduction to Angular',
            topics: ['Components', 'Templates', 'Services'],
            progress: 75,
            position: { x: 100, y: 150 },
            connections: ['2'],
            isCompleted: false,
            chapters: [
              {
                id: '1',
                title: 'Chapter 1',
                description: 'Getting Started',
                progress: 100,
                position: { x: 100, y: 100 },
                connections: ['2'],
                isCompleted: true,
                content: [
                  {
                    id: '1',
                    title: 'Defining components info',
                    type: 'text',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                    pdfUrl: '/assets/pdfs/lesson1-chapter1.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              },
              {
                id: '2',
                title: 'Chapter 2',
                description: 'Advanced Concepts',
                progress: 60,
                position: { x: 300, y: 100 },
                connections: ['3'],
                isCompleted: false,
                content: [
                  {
                    id: '1',
                    title: 'Dependency Injection',
                    type: 'text',
                    content: 'Angular uses dependency injection to provide services...',
                    pdfUrl: '/assets/pdfs/lesson1-chapter2.pdf',
                    isExpanded: false,
                    isViewed: false
                  },
                  {
                    id: '2',
                    title: 'Lifecycle Hooks',
                    type: 'text',
                    content: 'Learn about ngOnInit, ngOnDestroy, and other hooks...',
                    pdfUrl: '/assets/pdfs/lesson1-chapter2b.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              },
              {
                id: '3',
                title: 'Chapter 3',
                description: 'Final Chapter',
                progress: 0,
                position: { x: 500, y: 200 },
                connections: [],
                isCompleted: false,
                content: [
                  {
                    id: '1',
                    title: 'Final Concepts',
                    type: 'video',
                    content: 'Final video content',
                    videoUrl: '/assets/videos/final.mp4',
                    pdfUrl: '/assets/pdfs/lesson1-chapter3.pdf',
                    isExpanded: false,
                    isViewed: false
                  },
                  {
                    id: '2',
                    title: 'Deployment',
                    type: 'text',
                    content: 'How to deploy your Angular app to production...',
                    pdfUrl: '/assets/pdfs/lesson1-chapter3b.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              }
            ]
          },
          {
            id: '2',
            title: 'Lesson 2',
            description: 'Advanced Angular Concepts',
            topics: ['Routing', 'HTTP Client', 'Forms'],
            progress: 50,
            position: { x: 300, y: 250 },
            connections: ['3'],
            isCompleted: false,
            chapters: [
              {
                id: '1',
                title: 'L2-C1',
                description: 'Routing Basics',
                progress: 60,
                position: { x: 100, y: 100 },
                connections: ['2'],
                isCompleted: false,
                content: [
                  {
                    id: '1',
                    title: 'Required and optional inputs',
                    type: 'text',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                    pdfUrl: '/assets/pdfs/lesson2-chapter1.pdf',
                    isExpanded: false,
                    isViewed: false
                  },
                  {
                    id: '2',
                    title: 'Using signal inputs',
                    type: 'video',
                    content: 'Video content description',
                    videoUrl: '/assets/videos/signals.mp4',
                    pdfUrl: '/assets/pdfs/lesson2-chapter2.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              }
            ]
          },
          {
            id: '3',
            title: 'Lesson 3',
            description: 'Forms and Validation',
            topics: ['Reactive Forms', 'Template Forms', 'Validation'],
            progress: 25,
            position: { x: 150, y: 400 },
            connections: ['4'],
            isCompleted: false,
            chapters: [
              {
                id: '1',
                title: 'L3-C1',
                description: 'Form Basics',
                progress: 25,
                position: { x: 100, y: 100 },
                connections: [],
                isCompleted: false,
                content: [
                  {
                    id: '1',
                    title: 'Form Introduction',
                    type: 'text',
                    content: 'Introduction to Angular forms...',
                    pdfUrl: '/assets/pdfs/lesson3-chapter1.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              }
            ]
          },
          {
            id: '4',
            title: 'Lesson 4',
            description: 'HTTP and Services',
            topics: ['HTTP Client', 'Observables', 'Error Handling'],
            progress: 0,
            position: { x: 450, y: 350 },
            connections: ['5'],
            isCompleted: false,
            chapters: [
              {
                id: '1',
                title: 'L4-C1',
                description: 'HTTP Basics',
                progress: 0,
                position: { x: 100, y: 100 },
                connections: [],
                isCompleted: false,
                content: [
                  {
                    id: '1',
                    title: 'HTTP Introduction',
                    type: 'text',
                    content: 'Introduction to HTTP in Angular...',
                    pdfUrl: '/assets/pdfs/lesson4-chapter1.pdf',
                    isExpanded: false,
                    isViewed: false
                  }
                ]
              }
            ]
          },
          {
            id: '5',
            title: 'Lesson 5',
            description: 'Test',
            topics: ['Test'],
            progress: 5,
            position: { x: 0, y: 0 },
            connections: ['6'],
            isCompleted: false,
            chapters: []
          },
          {
            id: '6',
            title: 'Lesson 6',
            description: 'Test',
            topics: ['Test'],
            progress: 5,
            position: { x: 0, y: 0 },
            connections: ['7'],
            isCompleted: false,
            chapters: []
          },
          {
            id: '7',
            title: 'Lesson 7',
            description: 'Test',
            topics: ['Test'],
            progress: 5,
            position: { x: 0, y: 0 },
            connections: ['8'],
            isCompleted: false,
            chapters: []
          },
          {
            id: '8',
            title: 'Lesson 8',
            description: 'Test',
            topics: ['Test'],
            progress: 5,
            position: { x: 0, y: 0 },
            connections: [],
            isCompleted: false,
            chapters: []
          }
        ]
      },
      {
        id: '2',
        title: 'Course 2',
        description: 'Another course description',
        icon: 'code',
        progress: 0,
        lessons: []
      },
      {
        id: '3',
        title: 'Course 3',
        description: 'Yet another course description',
        icon: 'computer',
        progress: 0,
        lessons: []
      }
    ];
    this.coursesSubject.next(mockCourses);
  }

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourse(id: string): Observable<Course | undefined> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        observer.next(courses.find(course => course.id === id));
      });
    });
  }

  getLesson(courseId: string, lessonId: string): Observable<Lesson | undefined> {
    return new Observable(observer => {
      this.getCourse(courseId).subscribe(course => {
        observer.next(course?.lessons.find(lesson => lesson.id === lessonId));
      });
    });
  }

  getChapter(courseId: string, lessonId: string, chapterId: string): Observable<Chapter | undefined> {
    return new Observable(observer => {
      this.getLesson(courseId, lessonId).subscribe(lesson => {
        observer.next(lesson?.chapters.find(chapter => chapter.id === chapterId));
      });
    });
  }

  updateProgress(courseId: string, lessonId: string, chapterId: string, contentId: string): void {
    const courses = this.coursesSubject.value;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const chapter = lesson.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const content = chapter.content.find(c => c.id === contentId);
    if (!content) return;

    content.isViewed = true;
    
    // Update chapter progress
    const viewedContent = chapter.content.filter(c => c.isViewed).length;
    chapter.progress = Math.round((viewedContent / chapter.content.length) * 100);
    
    // Update lesson progress
    const totalChapterProgress = lesson.chapters.reduce((sum, c) => sum + c.progress, 0);
    lesson.progress = Math.round(totalChapterProgress / lesson.chapters.length);
    
    // Update course progress
    const totalLessonProgress = course.lessons.reduce((sum, l) => sum + l.progress, 0);
    course.progress = Math.round(totalLessonProgress / course.lessons.length);

    this.coursesSubject.next(courses);
  }
}