import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  const mockData = {
    title: 'Lesson 1',
    description: 'This is a test lesson',
    topics: ['Angular', 'Testing'],
    progress: 75
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render tooltip if data is null', () => {
    component.data = null;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tooltip-container')).toBeNull();
  });

  it('should render tooltip with correct title and description', () => {
    component.data = mockData;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tooltip-title')?.textContent).toContain('Lesson 1');
    expect(compiled.querySelector('.tooltip-description')?.textContent).toContain('This is a test lesson');
  });

  it('should render all topics', () => {
    component.data = mockData;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const topics = compiled.querySelectorAll('.tooltip-topics ul li');
    expect(topics.length).toBe(2);
    expect(topics[0].textContent).toContain('Angular');
    expect(topics[1].textContent).toContain('Testing');
  });

  it('should render progress bar with correct width and text', () => {
    component.data = mockData;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const progressFill = compiled.querySelector('.progress-fill') as HTMLElement;
    expect(progressFill.style.width).toBe('75%');
    expect(compiled.querySelector('.progress-text')?.textContent).toContain('75% Complete');
  });

  it('should render the info icon', () => {
    component.data = mockData;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tooltip-icon')?.textContent).toContain('info');
  });
});