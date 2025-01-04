import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  isLoading: boolean = false;
  isLoadingF: boolean = false;
  isLoadingO: boolean = false;
  isLoadingR: boolean = false;
  passwordFieldType: string = 'password';
  passwordFieldType2: string = 'password';
  password: string = '';
  tabs: number[] = [1, 2, 3, 4];
  activeTab: number = 1;
  email: string = '';
  isLoadingResend: boolean = false;
  token: string = '';

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
  togglePasswordVisibility2(): void {
    this.passwordFieldType2 =
      this.passwordFieldType2 === 'password' ? 'text' : 'password';
  }

  onLogin() {
    if (this.loginForm.get('userName')?.invalid) {
      this.toastr.error('The username field is required.');
      return;
    }
    if (this.loginForm.get('password')?.invalid) {
      this.toastr.error('The password field is required.');
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: ({ statusCode, data, message }) => {
        if (statusCode === 200) {
          if (data.role === 'Admin' || data.role === 'SuperAdmin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
          this.authService.setIsAuth(true);
        } else if (statusCode === 400) {
          this.isLoading = false;
          this.toastr.error(message);
          this.authService.setIsAuth(false);
        } else {
          this.isLoading = false;
          this.toastr.error(message);
          this.authService.setIsAuth(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  sentEmail(email: string): void {
    if (!email) {
      this.toastr.error('The email field is required.');
      return;
    }
    this.isLoadingF = true;
    this.authService.forgetPassword(email).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode == 200) {
          this.email = email;
          this.toastr.success(message);
          this.activeTab = 3;
          this.isLoadingF = false;
        } else if (statusCode === 400) {
          this.isLoadingF = false;
          this.toastr.error(message);
        } else {
          this.isLoadingF = false;
        }
      },
      error: (err) => {
        this.isLoadingF = false;
        console.log(err);
      },
    });
  }

  moveToNext(event: KeyboardEvent, nextInput: HTMLInputElement | null): void {
    const input = event.target as HTMLInputElement;
    const max = 9;
    if (parseInt(input.value, 9) > max) {
      input.value = max.toString();
    } else if (parseInt(input.value, 0) < 0) {
      input.value = '0'.toString();
    }
    if (/^[0-9]$/.test(event.key)) {
      nextInput?.focus();
    } else {
      this.toastr.warning('Enter a number!');
      input.focus();
    }
  }

  checkResetOtp(otp: string) {
    this.isLoadingO = true;
    if (otp.length == 4) {
      this.authService.checkResetOtp(this.email, otp).subscribe({
        next: ({ statusCode, message, errors, data }) => {
          if (statusCode == 200) {
            this.token = data;
            this.toastr.success(message);
            this.activeTab = 4;
            this.isLoadingO = false;
          } else if (statusCode === 400) {
            this.isLoadingO = false;
            this.toastr.error(message);
          } else {
            this.toastr.error(errors[0]);
            this.isLoadingO = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoadingO = false;
        },
      });
    }
  }
  empty(inp: HTMLInputElement) {
    inp.value = '';
  }

  resetPass(pass: string, pass2: string): void {
    if (!pass && !pass2) {
      this.toastr.error('The password field is required.');
      return;
    }
    this.isLoadingR = true;
    const info = {
      password: pass2,
      token: this.token,
      email: this.email,
    };
    this.authService.resetPassword(info).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode == 200) {
          this.toastr.success(message);
          this.activeTab = 1;
          this.isLoadingR = false;
        } else if (statusCode === 400) {
          this.isLoadingR = false;
          this.toastr.error(message);
        } else {
          this.isLoadingR = false;
        }
      },
      error: (err) => {
        this.isLoadingR = false;
        console.log(err);
      },
    });
  }
}
