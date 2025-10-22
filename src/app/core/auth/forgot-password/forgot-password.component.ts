import { Router } from '@angular/router';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading: boolean = false;
  step: number = 1;
  errMessage: string = '';
  successMessage: string = '';

  setEmailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  setCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6,}$/),
    ]),
  });

  setResetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z][a-zA-Z0-9@]{7,}$/),
    ]),
  });

  submitVerifyEmailForm(): void {
    if (this.setEmailForm.valid) {
      this.isLoading = true;
      this.authService
        .verifyEmail(this.setEmailForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.statusMsg === 'success') {
              this.errMessage = '';
              let emailValue = this.setEmailForm.get('email')?.value;
              this.setResetPasswordForm.get('email')?.patchValue(emailValue);
              this.successMessage = res.message;
              this.step = 2;
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.log(err);
            this.errMessage = err.error.message;
          },
        });
    } else {
      this.setEmailForm.markAllAsTouched();
    }
  }

  submitVerifyCodeForm(): void {
    if (this.setCodeForm.valid) {
      this.isLoading = true;
      this.authService
        .verifyResetCode(this.setCodeForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.status === 'Success') {
              this.errMessage = '';
              this.successMessage = '';
              this.step = 3;
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.log(err);
            this.successMessage = '';
            this.errMessage = err.error.message;
          },
        });
    } else {
      this.setCodeForm.markAllAsTouched();
    }
  }

  submitResetPasswordForm(): void {
    if (this.setResetPasswordForm.valid) {
      this.isLoading = true;
      this.authService
        .resetPassword(this.setResetPasswordForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.token) {
              this.errMessage = '';
              setTimeout(() => {
                this.cookieService.set('userToken', res.token);
                this.authService.sendUserData();
                this.router.navigate(['/home']);
              }, 800);
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.log(err);
            this.errMessage = err.error.message;
          },
        });
    } else {
      this.setResetPasswordForm.markAllAsTouched();
    }
  }
}
