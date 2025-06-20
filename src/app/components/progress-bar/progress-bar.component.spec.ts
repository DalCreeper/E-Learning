import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the SVG element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('svg.circular-progress')).toBeTruthy();
  });

  it('should display the correct title split in two lines', () => {
    component.title = 'Lesson 1';
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('text');
    expect(text.textContent).toContain('Lesson');
    expect(text.textContent).toContain('1');
  });

  it('should use completedColor when progress is 100', () => {
    component.progress = 100;
    component.completedColor = '#ABCDEF';
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('circle');
    expect(circle.getAttribute('fill')).toBe('#ABCDEF');
  });

  it('should use baseColor when progress is less than 100', () => {
    component.progress = 50;
    component.baseColor = '#123456';
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('circle');
    expect(circle.getAttribute('fill')).toBe('#123456');
  });

  it('should render progress-bar and progress-bg circles when progress < 100', () => {
    component.progress = 60;
    fixture.detectChanges();
    const bg = fixture.nativeElement.querySelector('circle.progress-bg');
    const bar = fixture.nativeElement.querySelector('circle.progress-bar');
    expect(bg).toBeTruthy();
    expect(bar).toBeTruthy();
  });

  it('should not render progress-bar and progress-bg circles when progress is 100', () => {
    component.progress = 100;
    fixture.detectChanges();
    const bg = fixture.nativeElement.querySelector('circle.progress-bg');
    const bar = fixture.nativeElement.querySelector('circle.progress-bar');
    expect(bg).toBeFalsy();
    expect(bar).toBeFalsy();
  });

  it('should calculate correct stroke-dashoffset for progress', () => {
    component.progress = 50;
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('circle.progress-bar');
    const expectedOffset = component.circumference - (component.progress / 100) * component.circumference;
    expect(Number(bar.getAttribute('stroke-dashoffset'))).toBeCloseTo(expectedOffset, 2);
  });
});