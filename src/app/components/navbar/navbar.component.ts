import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
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
  isOpened = signal<boolean>(false);
  router = inject(Router);
  currentPath: string = '';
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }
  constructor() {}
  handleIsOpened(): void {
    this.isOpened.set(!this.isOpened());
  }

  close(): void {
    this.isOpened.set(false);
  }

  navigateToSection(sectionId: string): void {
    this.scrollEvent.emit(sectionId);
    this.router.navigate(['/'], { fragment: sectionId });
  }
}
