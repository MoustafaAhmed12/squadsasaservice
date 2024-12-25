import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent implements OnInit {
  authService = inject(AuthService);
  ocSidebarService = inject(OcSidebarService);
  isShow: boolean = false;
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
  }
}
