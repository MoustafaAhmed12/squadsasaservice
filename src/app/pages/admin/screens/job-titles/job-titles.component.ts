import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { Profiles } from '../../models/admins';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminService } from '../../services/super-admin.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-titles',
  imports: [CurrencyPipe, FormsModule],
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
  isEdit: boolean = false;
  jobId: number = 0;
  jobName: string = '';
  jobPrice: number = 0;

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

  addjobTitle(): void {
    if (!this.jobName) {
      this.toastr.error('Name field is required');
      return;
    }
    if (!this.jobPrice) {
      this.toastr.error('Price field is required');
      return;
    }
    this.isLoadingAdd = true;
    this.adminService
      .addJobTitle({ name: this.jobName, price: this.jobPrice })
      .subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.getAllJobTitles();
            this.jobName = '';
            this.jobPrice = 0;
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

  getJobTitle(job: Profiles) {
    this.isEdit = true;
    this.jobName = job.name;
    this.jobPrice = job.price;
    this.jobId = job.id;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  editJobTitle() {
    if (!this.jobName) {
      this.toastr.error('Name field is required');
      return;
    }
    if (!this.jobPrice) {
      this.toastr.error('Price field is required');
      return;
    }
    this.isLoadingAdd = true;
    const info = {
      id: this.jobId,
      name: this.jobName,
      price: this.jobPrice,
    };
    this.adminService.updatejobTitles(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.getAllJobTitles();
          this.jobName = '';
          this.jobPrice = 0;
          this.toastr.success(message);
          this.isLoadingAdd = false;
          this.isEdit = false;
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
}
