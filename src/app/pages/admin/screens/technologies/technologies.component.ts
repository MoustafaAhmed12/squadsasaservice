import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../authentication/services/auth.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { AdminService } from '../../services/admin.service';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastrService } from 'ngx-toastr';
import { Profiles, Technologies } from '../../models/admins';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-technologies',
  imports: [NgClass, FormsModule],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
})
export class TechnologiesComponent implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  adminService = inject(AdminService);
  superAdminService = inject(SuperAdminService);
  toastr = inject(ToastrService);
  allTechnologies: Technologies[] = [] as Technologies[];
  techId: number = 0;
  isLoading: boolean = false;
  isDeleted: boolean = false;
  isLoadingAdd: boolean = false;
  icon: string = '';
  fileName: string = '';
  iconReview: string = '';
  isDropdownOpen: boolean = false;
  selectedProfiles: string[] = [];
  allJobTitles: Profiles[] = [];
  jobTitlesIds: number[] = [];
  checked: boolean = false;
  isLoadingDetails: boolean = false;
  rows: { id: number; name: string; isAvailable: false }[][] = [];
  ngOnInit() {
    this.getAllTechnologies();
    this.getAllJobTitles();
  }

  getAllTechnologies(): void {
    this.sharedService.getTechnologies().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTechnologies = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  isPNG(fileName: any) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'png';
  }

  addTech(techNameInput: HTMLInputElement): void {
    const techName = techNameInput.value.trim();
    if (!techName) {
      this.toastr.error('Name field is required');
      return;
    }
    if (!this.icon && !this.fileName) {
      console.log(this.icon);
      this.toastr.error('choose icon png');
      return;
    }
    if (!this.isPNG(this.fileName)) {
      this.toastr.error('Only PNG files are allowed.');
      return;
    }
    if (this.jobTitlesIds.length == 0) {
      this.toastr.error('Technology should have at least one job title');
      return;
    }
    this.isLoadingAdd = true;
    const info = {
      name: techName,
      iconFile: {
        fileName: this.fileName,
        base64: this.icon,
      },
      jobTitlesIds: this.jobTitlesIds,
    };
    console.log(info);
    this.adminService.addTechnology(info).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.getAllTechnologies();
          this.toastr.success(message);
          techNameInput.value = '';
          this.icon = '';
          this.fileName = '';
          this.iconReview = '';
          this.jobTitlesIds = [];
          this.selectedProfiles = [];
          this.isLoadingAdd = false;
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoadingAdd = false;
        } else if (statusCode === 500) {
          this.toastr.warning(message);
          this.isLoadingAdd = false;
        } else {
          errors.forEach((error: any) => {
            this.toastr.error(error);
          });
          this.isLoadingAdd = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAdd = false;
      },
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleProfile(profile: Profiles): void {
    if (this.selectedProfiles.includes(profile.name)) {
      this.selectedProfiles = this.selectedProfiles.filter(
        (r) => r !== profile.name
      );
      this.jobTitlesIds = this.jobTitlesIds.filter((r) => r !== profile.id);
    } else {
      this.selectedProfiles.push(profile.name);
      this.jobTitlesIds.push(profile.id);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.iconReview = reader.result as string;
        this.icon = this.iconReview.replace(/^data:image\/\w+;base64,/, '');
        this.fileName = file.name;
      };

      reader.onerror = (error) => {
        console.error('Error converting file to base64:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteTech(id: number) {
    this.techId = id;
    this.isDeleted = true;
    this.superAdminService.deletetechnology(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allTechnologies = this.allTechnologies.filter(
            (o) => o.id !== id
          );
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

  toggleExpand(techId: number): void {
    if (this.techId === techId) {
      this.techId = 0;
    } else {
      this.techId = techId;
      this.isLoadingDetails = true;
      this.adminService.getTechnologyById(techId).subscribe({
        next: ({ statusCode, data }) => {
          if (statusCode === 200) {
            this.rows = [];
            for (let i = 0; i < data.length; i += 3) {
              this.rows.push(data.slice(i, i + 3));
            }
            this.isLoadingDetails = false;
          } else {
            console.log('error');
            this.isLoadingDetails = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoadingDetails = false;
        },
      });
    }
  }

  onCheckboxChange(jobTitleId: number): void {
    this.superAdminService
      .changeProfileOfTech({ technologyId: this.techId, jobTitleId })
      .subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
          } else {
            this.toastr.error(message);
            console.log('error');
          }
        },
        error: (err) => {
          console.log(err);
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
}
