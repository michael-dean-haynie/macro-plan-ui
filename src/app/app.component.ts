import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { HeadingService } from './services/heading.service';

export interface NavItem {
  name: string;
  path: string;
  active: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // heading
  @ViewChild('heading')
  heading: ElementRef;
  headingText: string;

  // sidenav
  @ViewChild('sidenav')
  sidenav: MatSidenav;

  // navigation
  navItems: NavItem[] = [
    { name: 'Manage Food', path: 'manage-food', active: false },
    { name: 'Manage Dishes', path: 'manage-dishes', active: false },
    { name: 'Manage Plans', path: 'manage-plans', active: false }
  ];

  constructor(private router: Router, private headingService: HeadingService) { }

  ngOnInit() {
    // bind callback that activates nav buttons to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(event => {
        const navEvent = event as NavigationEnd;
        this.navItems.forEach(nav => {
          nav.active = navEvent.url.includes(nav.path);
        });
      })
    ).subscribe();

    // bind field to latest emmited value from service
    this.headingService.headingText$.subscribe(text => {
      this.headingText = text;
    });
  }

  getHeightOfHeading() {
    return this.heading.nativeElement.offsetHeight;
  }

  isActiveNav(path: string): boolean {
    return this.navItems.find(nav => nav.path === path).active;
  }

  onNavClick(nav: NavItem) {
    this.sidenav.close();
    this.router.navigate([nav.path]);
  }
}
