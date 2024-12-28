import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
})
export class MainSidebarComponent {
  ocSidebarService = inject(OcSidebarService);
  authService = inject(AuthService);
  hideSidebar(): void {
    this.ocSidebarService.openSidebar(false);
  }
}
