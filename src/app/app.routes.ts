import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseViewComponent } from './components/course-view/course-view.component';
import { LessonViewComponent } from './components/lesson-view/lesson-view.component';
import { ChapterContentComponent } from './components/chapter-content/chapter-content.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'course/:courseId', component: CourseViewComponent },
  { path: 'course/:courseId/lesson/:lessonId', component: LessonViewComponent },
  { path: 'course/:courseId/lesson/:lessonId/chapter/:chapterId', component: ChapterContentComponent },
  { path: '**', redirectTo: '/dashboard' }
];