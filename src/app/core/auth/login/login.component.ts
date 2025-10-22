import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth/auth.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LottieComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading: boolean = false;
  errMessage: string = '';
  successMessage: string = '';
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z][a-zA-Z0-9@]{7,}$/),
      ]),
    });
  }

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService
        .Signin(this.loginForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            if (res.message === 'success') {
              this.errMessage = '';
              this.successMessage = res.message;
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
      this.loginForm.markAllAsTouched();
    }
  }

  options: AnimationOptions = {
    path: 'animations/shopping.json',
  };
}
