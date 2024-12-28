import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from '../../../../authentication/services/auth.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastrService } from 'ngx-toastr';
import { Areas, Technologies } from '../../models/admins';
import { AdminService } from '../../services/admin.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-areas',
  imports: [NgClass, FormsModule],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss',
})
export class AreasComponent {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  adminService = inject(AdminService);
  superAdminService = inject(SuperAdminService);
  toastr = inject(ToastrService);
  allArea: Areas[] = [] as Areas[];
  allTechnologies: Technologies[] = [];
  technologiesIds: number[] = [];
  areaId: number = 0;
  isLoading: boolean = false;
  isDeleted: boolean = false;
  isLoadingAdd: boolean = false;
  isLoadingDetails: boolean = false;
  isDropdownOpen: boolean = false;
  selectedTech: string[] = [];
  checked: boolean = false;
  rows: { id: number; name: string; iconUrl: string; isAvailable: false }[][] =
    [];

  ngOnInit() {
    this.getAllAreas();
    this.getAllTechnologies();
  }

  getAllAreas(): void {
    this.sharedService.getAreas().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allArea = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleTech(tech: Technologies): void {
    if (this.selectedTech.includes(tech.name)) {
      this.selectedTech = this.selectedTech.filter((r) => r !== tech.name);
      this.technologiesIds = this.technologiesIds.filter((r) => r !== tech.id);
    } else {
      this.selectedTech.push(tech.name);
      this.technologiesIds.push(tech.id);
    }
  }

  addArea(areaNameInput: HTMLInputElement): void {
    const areaName = areaNameInput.value.trim();
    if (!areaName) {
      this.toastr.error('Name is required');
      return;
    }
    if (this.technologiesIds.length == 0) {
      this.toastr.error('Area should have at least one technology');
      return;
    }
    this.isLoadingAdd = true;
    const info = {
      name: areaName,
      technologiesIds: this.technologiesIds,
    };
    this.adminService.addArea(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.getAllAreas();
          this.toastr.success(message);
          this.selectedTech = [];
          this.technologiesIds = [];
          areaNameInput.value = '';
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

  deleteArea(id: number) {
    this.areaId = id;
    this.isDeleted = true;
    this.superAdminService.deleteArea(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allArea = this.allArea.filter((o) => o.id !== id);
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

  toggleExpand(areaId: number): void {
    if (this.areaId === areaId) {
      this.areaId = 0;
    } else {
      this.areaId = areaId;
      this.isLoadingDetails = true;
      this.adminService.getAreaById(areaId).subscribe({
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

  onCheckboxChange(technologyId: number): void {
    this.superAdminService
      .changeTechnologiesOfArea({ areaId: this.areaId, technologyId })
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
