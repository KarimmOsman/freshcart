import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { IWishlist } from '../../core/models/iwishlist';
import { WishlistService } from './services/wishlist.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly destroyRef = inject(DestroyRef);

  wishlistDetails: IWishlist = {} as IWishlist;

  ngOnInit(): void {
    this.getWishlistData();
  }

  getWishlistData(): void {
    this.wishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.wishlistDetails = res;
        },
      });
  }

  removeProductFromWishlist(id: string): void {
    this.wishlistService
      .removeSpecificWishlistItem(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.wishlistDetails.data = this.wishlistDetails.data.filter(
            (item) => item.id !== id
          );
          this.wishlistDetails.count = this.wishlistDetails.data.length;
          this.wishlistService.wishlistItemsCount.set(
            this.wishlistDetails.count
          );
        },
      });
  }
}
