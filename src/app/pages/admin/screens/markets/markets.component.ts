import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { Markets } from '../../models/admins';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminService } from '../../services/super-admin.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-markets',
  imports: [],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent implements OnInit {
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  adminService = inject(AdminService);
  superAdminService = inject(SuperAdminService);
  toastr = inject(ToastrService);
  allMarkets: Markets[] = [] as Markets[];
  marketId: number = 0;
  isLoading: boolean = false;
  isDeleted: boolean = false;
  isLoadingAdd: boolean = false;
  iconFile!: { fileName: string; base64: string };
  icon: string = '';
  ngOnInit() {
    this.getAllMarkets();
  }

  getAllMarkets(): void {
    this.sharedService.getMarkets().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allMarkets = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addMarket(marketNameInput: HTMLInputElement): void {
    const marketName = marketNameInput.value.trim();
    if (!marketName && Object.keys(this.iconFile).length === 0) return;
    this.isLoadingAdd = true;
    console.log(marketName, this.iconFile);
    const info = {
      name: marketName,
      iconFile: this.iconFile,
    };
    this.adminService.addMarket(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.getAllMarkets();
          // this.allUniversities.push({ name: universityName });
          this.toastr.success(message);
          marketNameInput.value = '';
          this.icon = '';
          this.iconFile = { base64: '', fileName: '' };
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

  deleteMarket(id: number) {
    this.marketId = id;
    this.isDeleted = true;
    this.superAdminService.deleteMarket(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allMarkets = this.allMarkets.filter((o) => o.id !== id);
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
