export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  topics: string[];
  chapters: Chapter[];
  progress: number;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected lessons
  isCompleted: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: ChapterContent[];
  progress: number;
  position: { x: number; y: number };
  connections: string[];
  isCompleted: boolean;
}

export interface ChapterContent {
  id: string;
  title: string;
  type: 'text' | 'video';
  content: string;
  videoUrl?: string;
  pdfUrl: string;
  isExpanded: boolean;
  isViewed: boolean;
}
