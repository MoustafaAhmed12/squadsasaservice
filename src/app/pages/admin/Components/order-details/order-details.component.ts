import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Order } from '../../models/admins';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [NgClass],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnChanges {
  @Input() orderId: number = 0;
  @Output() closeModal = new EventEmitter<boolean>();
  adminService = inject(AdminService);
  isLoading: boolean = false;
  order: Order = {} as Order;
  totalQuantity: number = 0;

  ngOnChanges(): void {
    if (this.orderId) {
      this.getOrder(this.orderId);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#pop');
    if (!isInsideDropdown) {
      this.closeModal.emit(false);
    }
  }

  getOrder(orderId: number): void {
    this.isLoading = true;
    this.adminService.getOrderById(orderId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.order = data;
          this.totalQuantity = this.order.profiles.reduce(
            (sum, job) => sum + job.quantity,
            0
          );
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
}
