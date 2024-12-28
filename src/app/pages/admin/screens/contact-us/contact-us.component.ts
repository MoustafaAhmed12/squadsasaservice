import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ContactUs } from '../../models/admins';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  imports: [NgClass],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit {
  adminService = inject(AdminService);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  allContacts: ContactUs[] = [] as ContactUs[];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalCount: number = 1;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];
  contactId: number = 0;
  isDeleted: boolean = false;
  ngOnInit() {
    this.getAllContacts(1, this.pageSize);
  }
  getAllContacts(currentPage: number, pageSize: number): void {
    this.isLoading = true;
    this.adminService.getAllContactUs(currentPage, pageSize).subscribe({
      next: ({ statusCode, data, totalPages, totalCount, currentPage }) => {
        if (statusCode === 200) {
          this.allContacts = data;
          this.totalPages = totalPages;
          this.totalCount = totalCount;
          this.currentPage = currentPage;
          this.generatePages();
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

  generatePages(): void {
    this.pages = [];
    if (this.totalPages <= 3) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currentPage - 2, 1);
      const end = Math.min(this.currentPage + 2, this.totalPages);
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < this.totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllContacts(this.currentPage, this.pageSize);
      this.generatePages();
    }
  }

  deleteContact(id: number) {
    this.contactId = id;
    this.isDeleted = true;
    this.adminService.deleteContactUs(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.allContacts = this.allContacts.filter((o) => o.id !== id);
          this.totalCount = --this.totalCount;
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
