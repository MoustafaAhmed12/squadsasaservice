import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OcSidebarService {
  isOpen = signal<boolean>(true);

  constructor() {
    if (window.innerWidth <= 768) {
      this.isOpen.set(false);
    } else {
      this.isOpen.set(true);
    }
  }

  openSidebar(isOpen: boolean): void {
    if (isOpen === false) {
      this.isOpen.set(true);
    } else {
      this.isOpen.set(false);
    }
  }
}
