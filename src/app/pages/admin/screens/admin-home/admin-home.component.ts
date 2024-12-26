import { Component, inject, OnInit } from '@angular/core';
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
}
