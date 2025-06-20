import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const mockNavigationItems = [
    { id: '1', title: 'Course 1', route: '/course/1' },
    { id: '2', title: 'Lesson 1', route: '/course/1/lesson/1' },
    { id: '3', title: 'Chapter 1', route: '/course/1/lesson/1/chapter/1' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, BrowserAnimationsModule],
      providers: [
      { provide: ActivatedRoute, useValue: {} }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.isOpen = true;
    component.navigationItems = mockNavigationItems;
    component.navTitle = 'Test Sidebar';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.nav-title-header')?.textContent).toContain('Test Sidebar');
  });

  it('should render all navigation items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.nav-item').length).toBe(3);
  });

  it('should render the correct icons for each item', () => {
    const icons = fixture.debugElement.queryAll(By.css('.nav-icon-left'));
    expect(icons[0].nativeElement.textContent).toContain('school');
    expect(icons[1].nativeElement.textContent).toContain('play_circle_outline');
    expect(icons[2].nativeElement.textContent).toContain('article');
  });

  it('should emit sidebarClosed when backdrop is clicked', () => {
    spyOn(component.sidebarClosed, 'emit');
    const backdrop = fixture.debugElement.query(By.css('.sidenav-backdrop'));
    backdrop.triggerEventHandler('click');
    expect(component.sidebarClosed.emit).toHaveBeenCalled();
  });

  it('should emit sidebarClosed when close button is clicked', () => {
    spyOn(component.sidebarClosed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.close-button'));
    expect(closeBtn).toBeTruthy();
    closeBtn.triggerEventHandler('click');
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav'));
    sidenav.triggerEventHandler('closedStart');
    expect(component.sidebarClosed.emit).toHaveBeenCalled();
  });

  it('should not render chevron_right icon if disableItemLinks is true', () => {
    component.disableItemLinks = true;
    fixture.detectChanges();
    const chevrons = fixture.nativeElement.querySelectorAll('.nav-icon-right');
    expect(chevrons.length).toBe(0);
  });

  it('should render chevron_right icon if disableItemLinks is false', () => {
    component.disableItemLinks = false;
    fixture.detectChanges();
    const chevrons = fixture.nativeElement.querySelectorAll('.nav-icon-right');
    expect(chevrons.length).toBe(3);
  });

  it('should have nav-item.disabled class if disableItemLinks is true', () => {
    component.disableItemLinks = true;
    fixture.detectChanges();
    const navItems = fixture.nativeElement.querySelectorAll('.nav-item.disabled');
    expect(navItems.length).toBe(3);
  });
});