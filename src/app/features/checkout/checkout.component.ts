import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  checkOutForm!: FormGroup;
  cartId!: string;

  ngOnInit(): void {
    this.initForm();
    this.getCartId();
  }

  initForm(): void {
    this.checkOutForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      city: [null, [Validators.required]],
    });
  }

  getCartId(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (param) => {
          this.cartId = param.get('id')!;
          console.log(this.cartId);
        },
      });
  }

  submitCheckOutForm(type?: 'cash' | 'online'): void {
    console.log(this.checkOutForm.value);
    if (this.checkOutForm.invalid) return;
    if (type === 'online') {
      this.ordersService
        .checkOutSession(this.cartId, this.checkOutForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.status === 'success') {
              open(res.session.url, '_self');
            }
          },
        });
    } else if (type === 'cash') {
      this.ordersService
        .createCashOrder(this.cartId, this.checkOutForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.toastrService.success(
                'Order placed successfully!',
                'Cash Payment'
              );
              setTimeout(() => {
                this.cartService
                  .clearUserCart()
                  .pipe(takeUntilDestroyed(this.destroyRef))
                  .subscribe({
                    next: (res) => {
                      this.cartService.cartItemsCount.set(0);
                    },
                  });
                this.router.navigate(['/home']);
              }, 500);
            }
          },
        });
    }
  }
}
