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
  icon: string = '';
  fileName: string = '';
  iconReview: string = '';
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

  isPNG(fileName: any) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'png';
  }

  addMarket(marketNameInput: HTMLInputElement): void {
    const marketName = marketNameInput.value.trim();
    if (!marketName) {
      this.toastr.error('Name field is required');
      return;
    }
    if (!this.icon && !this.fileName) {
      this.toastr.error('choose icon png');
      return;
    }
    if (!this.isPNG(this.fileName)) {
      this.toastr.error('Only PNG files are allowed.');
      return;
    }
    this.isLoadingAdd = true;
    const info = {
      name: marketName,
      iconFile: {
        fileName: this.fileName,
        base64: this.icon,
      },
    };
    this.adminService.addMarket(info).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.getAllMarkets();
          this.toastr.success(message);
          marketNameInput.value = '';
          this.icon = '';
          this.fileName = '';
          this.iconReview = '';
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
