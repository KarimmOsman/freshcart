import { Component, inject, Input, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../features/cart/services/cart.service';
import { CurrencyPipe, DecimalPipe, NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../core/models/iproduct';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

interface ServiceResponse {
  status: 'success' | 'error';
  message: string;
  numOfCartItems?: number;
  data?: any[];
}

@Component({
  selector: 'app-card',
  imports: [RouterLink, CurrencyPipe, DecimalPipe, NgClass],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  private readonly toasterService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly destroyRef = inject(DestroyRef);
  @Input({ required: true }) product: IProduct = {} as IProduct;
  isInWishlist = signal(false);

  ngOnInit() {
    this.wishlistService
      .isProductInWishlist(this.product.id)
      .subscribe((exists: boolean) => this.isInWishlist.set(exists));
  }

  starClass(starIndex: number): string {
    const rating = Number(this.product?.ratingsAverage ?? 0);
    if (rating >= starIndex) return 'fas fa-star';
    if (rating >= starIndex - 0.5) return 'fas fa-star-half-alt';
    return 'far fa-star';
  }

  addToCart(event: Event, Id: string): void {
    event.stopPropagation();
    this.cartService
      .addProductToCart(Id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartService.cartItemsCount.set(res.numOfCartItems);
          if (res.status === 'success')
            this.toasterService.success(res.message);
        },
      });
  }

  toggleWishlist(event: Event, Id: string): void {
    event.stopPropagation();
    if (this.isInWishlist()) {
      this.wishlistService
        .removeSpecificWishlistItem(Id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.wishlistService.wishlistItemsCount.set(res.data.length);
            this.isInWishlist.set(false);
            this.toasterService.info('Removed from wishlist');
          },
        });
    } else {
      this.wishlistService
        .addProductToWishlist(Id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.wishlistService.wishlistItemsCount.set(res.data.length);
            this.isInWishlist.set(true);
            if (res.status === 'success')
              this.toasterService.success(res.message);
          },
        });
    }
  }
}
