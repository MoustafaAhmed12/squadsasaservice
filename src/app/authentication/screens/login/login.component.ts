import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  submitted = false;
  error: string = '';
  isLoading: boolean = false;
  passwordFieldType: string = 'password';
  password: string = '';

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    debugger;
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: ({ statusCode, data, message }) => {
        if (statusCode === 200) {
          console.log(data);
          if (data.role === 'Admin' || data.role === 'SuperAdmin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
          this.authService.setIsAuth(true);
        } else if (statusCode === 400) {
          this.isLoading = false;
          this.error = message;
          this.authService.setIsAuth(false);
        } else {
          this.isLoading = false;
          this.error = message;
          this.authService.setIsAuth(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
