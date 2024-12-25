import { Component, inject } from '@angular/core';
import { MainNavbarComponent } from './Components/main-navbar/main-navbar.component';
import { MainMobileNavComponent } from './Components/main-mobile-nav/main-mobile-nav.component';
import { MainSidebarComponent } from './Components/main-sidebar/main-sidebar.component';
import { OcSidebarService } from '../../shared/services/oc-sidebar.service';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  imports: [
    MainNavbarComponent,
    MainMobileNavComponent,
    MainSidebarComponent,
    NgClass,
    RouterOutlet,
  ],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  oc = inject(OcSidebarService);
}
