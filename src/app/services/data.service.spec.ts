import { DataService } from './data.service';
import { take } from 'rxjs/operators';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    service = new DataService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all courses', (done) => {
    service.getCourses().pipe(take(1)).subscribe(courses => {
      expect(Array.isArray(courses)).toBeTrue();
      expect(courses.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return a course by id', (done) => {
    service.getCourse('1').pipe(take(1)).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course?.id).toBe('1');
      done();
    });
  });

  it('should return a lesson by courseId and lessonId', (done) => {
    service.getLesson('1', '1').pipe(take(1)).subscribe(lesson => {
      expect(lesson).toBeTruthy();
      expect(lesson?.id).toBe('1');
      done();
    });
  });

  it('should return a chapter by courseId, lessonId and chapterId', (done) => {
    service.getChapter('1', '1', '1').pipe(take(1)).subscribe(chapter => {
      expect(chapter).toBeTruthy();
      expect(chapter?.id).toBe('1');
      done();
    });
  });

  it('should update progress for content, chapter, lesson and course', (done) => {
    service.getChapter('1', '1', '1').pipe(take(1)).subscribe(chapter => {
      expect(chapter).toBeTruthy();
      const content = chapter!.content[0];
      expect(content.isViewed).toBeFalse();

      service.updateProgress('1', '1', '1', content.id);

      service.getChapter('1', '1', '1').pipe(take(1)).subscribe(updatedChapter => {
        const updatedContent = updatedChapter!.content[0];
        expect(updatedContent.isViewed).toBeTrue();
        expect(updatedChapter!.progress).toBeGreaterThan(0);

        service.getLesson('1', '1').pipe(take(1)).subscribe(updatedLesson => {
          expect(updatedLesson!.progress).toBeGreaterThan(0);

          service.getCourse('1').pipe(take(1)).subscribe(updatedCourse => {
            expect(updatedCourse!.progress).toBeGreaterThan(0);
            done();
          });
        });
      });
    });
  });

  it('should return undefined for a non-existent course', (done) => {
    service.getCourse('not-exist').pipe(take(1)).subscribe(course => {
      expect(course).toBeUndefined();
      done();
    });
  });

  it('should return undefined for a non-existent lesson', (done) => {
   service.getLesson('not-exist', 'not-exist').pipe(take(1)).subscribe(lesson => {
      expect(lesson).toBeUndefined();
      done();
    });
  });

  it('should return undefined for a non-existent chapter', (done) => {
    service.getChapter('not-exist', 'not-exist', 'not-exist').pipe(take(1)).subscribe(chapter => {
      expect(chapter).toBeUndefined();
      done();
    });
  });

  it('should not throw if updateProgress is called with invalid ids', () => {
    expect(() => service.updateProgress('not-exist', 'not-exist', 'not-exist', 'not-exist')).not.toThrow();
  });

  it('should not update progress if contentId does not exist', (done) => {
    service.getChapter('1', '1', '1').pipe(take(1)).subscribe(chapterBefore => {
      service.updateProgress('1', '1', '1', 'not-exist');
      service.getChapter('1', '1', '1').pipe(take(1)).subscribe(chapterAfter => {
        expect(chapterAfter?.content.every(c => !c.isViewed)).toBeTrue();
        done();
      });
    });
  });

  it('should not update progress if chapterId does not exist', () => {
    expect(() => service.updateProgress('1', '1', 'not-exist', 'c1')).not.toThrow();
  });

  it('should not update progress if lessonId does not exist', () => {
    expect(() => service.updateProgress('1', 'not-exist', '1', 'c1')).not.toThrow();
  });

  it('should not update progress if courseId does not exist', () => {
    expect(() => service.updateProgress('not-exist', '1', '1', 'c1')).not.toThrow();
  });

  it('should not update progress if all ids are invalid', () => {
    expect(() => service.updateProgress('not-exist', 'not-exist', 'not-exist', 'not-exist')).not.toThrow();
  });

  it('should not update progress if content is already viewed', (done) => {
    const freshService = new DataService();
    freshService.updateProgress('1', '1', '1', '1');
    freshService.getChapter('1', '1', '1').pipe(take(1)).subscribe(chapter => {
      const content = chapter?.content.find(c => c.id === '1');
      expect(content?.isViewed).toBeTrue();
      expect(() => freshService.updateProgress('1', '1', '1', '1')).not.toThrow();
      freshService.getChapter('1', '1', '1').pipe(take(1)).subscribe(updatedChapter => {
      const updatedContent = updatedChapter?.content.find(c => c.id === '1');
        expect(updatedContent?.isViewed).toBeTrue();
        done();
      });
    });
  });
});