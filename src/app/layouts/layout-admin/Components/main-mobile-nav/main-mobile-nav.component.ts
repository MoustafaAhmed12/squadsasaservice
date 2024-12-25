import { Component, inject } from '@angular/core';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-mobile-nav',
  standalone: true,
  imports: [],
  templateUrl: './main-mobile-nav.component.html',
  styleUrl: './main-mobile-nav.component.scss',
})
export class MainMobileNavComponent {
  ocSidebarService = inject(OcSidebarService);

  show(): void {
    if (this.ocSidebarService.isOpen() === true) {
      this.ocSidebarService.openSidebar(false);
    } else {
      this.ocSidebarService.openSidebar(true);
    }
  }
}
