import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  clientService = inject(ClientService);
  fb = inject(FormBuilder);
  contactForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {
    this.contactForm = this.fb.group({
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      telphone: ['', Validators.required],
      company: [''],
      message: ['', Validators.required],
      subscribe: [false],
      acceptPolicy: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.clientService.contactUs(this.contactForm.value).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          alert('done');
          this.isLoading = false;
        } else {
          console.log('error');
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
