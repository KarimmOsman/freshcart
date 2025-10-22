import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  options = {
    path: 'assets/animations/register.json',
    renderer: 'svg',
    autoplay: true,
    loop: true,
  };

  isLoading: boolean = false;
  errMessage: string = '';
  successMessage: string = '';
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z0-9@]{7,}$/)],
        ],
        rePassword: ['', [Validators.required]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  submitRegisterForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errMessage = '';
      this.successMessage = '';

      this.authService
        .Signup(this.registerForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            if (res.message === 'success') {
              this.successMessage =
                'Account created successfully! Redirecting to login...';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1500);
            }
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errMessage =
              err.error.message || 'An error occurred during registration';
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private passwordMatchValidator = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password');
    const rePassword = group.get('rePassword');

    if (!password || !rePassword) {
      return null;
    }

    return password.value === rePassword.value ? null : { mismatch: true };
  };
}
