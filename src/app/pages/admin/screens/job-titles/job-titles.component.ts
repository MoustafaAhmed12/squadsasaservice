import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { Profiles } from '../../models/admins';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminService } from '../../services/super-admin.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-job-titles',
  imports: [],
  templateUrl: './job-titles.component.html',
  styleUrl: './job-titles.component.scss',
})
export class JobTitlesComponent implements OnInit {
  authService = inject(AuthService);
  adminService = inject(AdminService);
  sharedService = inject(SharedService);
  superAdminService = inject(SuperAdminService);
  toastr = inject(ToastrService);
  allJobTitles: Profiles[] = [];
  isLoading: boolean = false;
  isLoadingAdd: boolean = false;
  isDeleted: boolean = false;
  jobId: number = 0;

  ngOnInit() {
    this.getAllJobTitles();
  }

  getAllJobTitles(): void {
    this.isLoading = true;
    this.adminService.getjobTitles().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allJobTitles = data;
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

  addjobTitle(jobNameInput: HTMLInputElement): void {
    const jobName = jobNameInput.value.trim();
    if (!jobName) return;
    this.isLoadingAdd = true;
    this.adminService.addJobTitle({ name: jobName }).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.getAllJobTitles();
          jobNameInput.value = '';
          this.toastr.success(message);
          this.isLoadingAdd = false;
        } else {
          this.isLoadingAdd = false;
          this.toastr.error(message);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAdd = false;
      },
    });
  }

  deleteJobTitle(id: number) {
    this.jobId = id;
    this.isDeleted = true;
    this.superAdminService.deleteJobTitles(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allJobTitles = this.allJobTitles.filter((o) => o.id !== id);
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
