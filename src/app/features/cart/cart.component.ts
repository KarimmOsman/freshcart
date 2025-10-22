import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICart } from '../../core/models/icart';
import { CartService } from './services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  cartDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService
      .getLoggedUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => (this.cartDetails = res.data),
      });
  }

  removeProductFromCart(id: string): void {
    this.cartService
      .removeSpecificCartItem(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartDetails = res.data;
          this.cartService.cartItemsCount.set(res.numOfCartItems);
        },
      });
  }

  updateProductCount(id: string, count: number): void {
    if (count < 1) return;
    this.cartService
      .updateCartProductQuantity(id, count)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartDetails = res.data;
          this.cartService.cartItemsCount.set(res.numOfCartItems);
        },
      });
  }

  clearCart(): void {
    this.cartService
      .clearUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cartDetails = {} as ICart;
          this.cartService.cartItemsCount.set(0);
        },
      });
  }
}
