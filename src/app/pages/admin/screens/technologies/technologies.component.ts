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
  iconFile!: { fileName: string; base64: string };
  icon: string = '';
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

  addTech(techNameInput: HTMLInputElement): void {
    const techName = techNameInput.value.trim();
    if (!techName && Object.keys(this.iconFile).length === 0) return;
    this.isLoadingAdd = true;
    console.log(techName, this.iconFile);
    const info = {
      name: techName,
      iconFile: this.iconFile,
    };
    this.adminService.addTechnology(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.getAllTechnologies();
          this.toastr.success(message);
          techNameInput.value = '';
          this.icon = '';
          this.iconFile = { base64: '', fileName: '' };
          this.jobTitlesIds = [];
          this.selectedProfiles = [];
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
        this.icon = reader.result as string;
        const cleanedBase64 = this.icon.replace(/^data:image\/\w+;base64,/, '');

        this.iconFile = {
          fileName: file.name,
          base64: cleanedBase64,
        };
        console.log(this.iconFile);
        console.log(this.icon);
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
