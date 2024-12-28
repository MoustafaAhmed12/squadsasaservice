import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  clientService = inject(ClientService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  contactForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {
    this.contactForm = this.fb.group({
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      telphone: ['', Validators.required],
      company: ['', [Validators.required]],
      question: [''],
      subscribe: [false],
      acceptPolicy: [false],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.displayFormErrors();
      return;
    }
    if (this.contactForm.get('acceptPolicy')?.value === false) {
      this.toastr.warning(
        'You should accept the legal notice and the privacy policy.'
      );
      return;
    }
    this.isLoading = true;
    this.clientService.contactUs(this.contactForm.value).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.contactForm.reset();
          this.contactForm.get('subscribe')?.setValue(false);
          this.isLoading = false;
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
    Object.keys(this.contactForm.controls).forEach((field) => {
      const control = this.contactForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }
}
