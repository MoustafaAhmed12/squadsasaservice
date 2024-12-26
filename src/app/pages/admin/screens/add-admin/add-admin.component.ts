import { NgClass } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SuperAdminService } from '../../services/super-admin.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-admin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss',
})
export class AddAdminComponent implements OnInit {
  superAdminService = inject(SuperAdminService);
  fb = inject(FormBuilder);
  router = inject(Router);
  toastr = inject(ToastrService);
  adminForm!: FormGroup;
  adminId: string = '';
  isLoading: boolean = false;
  isDropdownOpen: boolean = false;
  roleName: string = '';

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      userName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  addAdmin() {
    if (this.adminForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;

    this.superAdminService.createAdmin(this.adminForm.value).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.adminForm.reset();
          this.isLoading = false;
          this.router.navigate(['/']);
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoading = false;
        } else if (statusCode === 500) {
          this.toastr.warning(message);
          this.isLoading = false;
        } else {
          errors.forEach((error: any) => {
            this.toastr.error(error);
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  displayFormErrors() {
    Object.keys(this.adminForm.controls).forEach((field) => {
      const control = this.adminForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  selectRole(role: string): void {
    this.roleName = role;
    this.isDropdownOpen = false;
    this.adminForm.get('role')?.setValue(role);
  }
}
