import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { SuperAdminService } from '../../services/super-admin.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { Admins } from '../../models/admins';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  authService = inject(AuthService);
  adminService = inject(AdminService);
  superAdminService = inject(SuperAdminService);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  allAdmins: Admins[] = [];
  isDeleted: boolean = false;
  adminId: string = '';
  isDropdownOpen: boolean = false;

  userId: string = '';
  roleName: string = '';
  ngOnInit() {
    this.getAllAdmins();
  }

  getAllAdmins(): void {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allAdmins = data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  deleteAdmin(id: string) {
    this.adminId = id;
    this.isDeleted = true;
    this.superAdminService.deleteAdmin(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allAdmins = this.allAdmins.filter((o) => o.id !== id);
          this.isDeleted = false;
          this.toastr.success(message);
        } else {
          console.log('error');
          this.isDeleted = false;
          this.toastr.error(message);
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted = false;
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#dropdown');
    if (!isInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(userId: string) {
    this.userId = userId;
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  selectRole(role: string, userId: string): void {
    this.roleName = role;
    const info = { userId, role };

    this.editRole(info);
  }

  editRole(info: any): void {
    this.superAdminService.editRole(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.isDropdownOpen = false;
          this.getAllAdmins();
        } else {
          console.log('error');
          this.toastr.error(message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
