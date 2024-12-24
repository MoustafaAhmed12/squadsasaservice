import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() scrollEvent = new EventEmitter<string>();
  isOpened: boolean = false;
  router = inject(Router);
  currentPath: string = '';
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
      });
    console.log(this.currentPath);
  }
  constructor() {}
  handleIsOpened(): void {
    this.isOpened = !this.isOpened;
  }

  scrollTo(sectionId: string): void {
    this.scrollEvent.emit(sectionId);
  }
}
