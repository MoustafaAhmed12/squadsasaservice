import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Orders } from '../../models/admins';
import { NgClass } from '@angular/common';
import { OrderDetailsComponent } from '../../Components/order-details/order-details.component';

@Component({
  selector: 'app-orders',
  imports: [NgClass, OrderDetailsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  adminService = inject(AdminService);
  isLoading: boolean = false;
  allOrders: Orders[] = [] as Orders[];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalCount: number = 1;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];
  isOpenPop = signal<boolean>(false);
  orderId: number = 0;
  isDeleted: boolean = false;
  ngOnInit() {
    this.getAllOrders(1, this.pageSize);
  }

  getAllOrders(currentPage: number, pageSize: number): void {
    this.isLoading = true;
    this.adminService.getAllOrders(currentPage, pageSize).subscribe({
      next: ({ statusCode, data, totalPages, totalCount, currentPage }) => {
        if (statusCode === 200) {
          this.allOrders = data;
          this.totalPages = totalPages;
          this.totalCount = totalCount;
          this.currentPage = currentPage;
          this.generatePages();
          console.log(data);
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

  showPop(id: number) {
    this.orderId = id;
    this.isOpenPop.set(true);
  }

  handleClose(isClosed: boolean) {
    this.isOpenPop.set(isClosed);
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
      this.getAllOrders(this.currentPage, this.pageSize);
      this.generatePages();
    }
  }

  deleteOrder(id: number) {
    this.orderId = id;
    this.isDeleted = true;
    this.adminService.deleteOrder(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.allOrders = this.allOrders.filter((o) => o.id !== id);
          this.totalCount = --this.totalCount;
          // this.isLoading.update((v) => (v = false));
          this.isDeleted = false;
        } else {
          console.log('error');
          this.isDeleted = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted = false;
      },
    });
  }
}
