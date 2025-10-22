import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../core/models/iproduct';
import { ProductDetailsService } from './services/product-details.service';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { WishlistService } from '../wishlist/services/wishlist.service';

@Component({
  selector: 'app-details',
  imports: [DecimalPipe, CurrencyPipe, NgClass],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toasterService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  detailedProduct: IProduct | null = null;
  productId: string | null = null;
  isInWishlist = signal(false);

  ngOnInit(): void {
    this.getProductId();
  }

  getProductId(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params) => {
          this.productId = params.get('id');
          if (this.productId) {
            this.getProductDetailsData();
            this.checkIfInWishlist(this.productId);
          }
        },
      });
  }

  getProductDetailsData(): void {
    if (!this.productId) return;
    this.productDetailsService
      .getSpecificProduct(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.detailedProduct = res.data;
        },
      });
  }

  checkIfInWishlist(productId: string): void {
    this.wishlistService
      .isProductInWishlist(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((exists: boolean) => this.isInWishlist.set(exists));
  }

  toggleWishlist(Id: string): void {
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

  addToCart(Id: string): void {
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

  goBack(): void {
    window.history.back();
  }
}
