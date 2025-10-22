import { WishlistService } from './../../../features/wishlist/services/wishlist.service';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { AuthService } from '../../../core/auth/services/auth/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly flowbiteService = inject(FlowbiteService);
  readonly destroyRef = inject(DestroyRef);

  isLogin = input<boolean>(true);

  countCartNumber: Signal<number> = computed(() =>
    this.cartService.cartItemsCount()
  );
  countWishlistNumber: Signal<number> = computed(() =>
    this.wishlistService.wishlistItemsCount()
  );

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });

    if (this.isLogin()) {
      this.cartService
        .getLoggedUserCart()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.cartService.cartItemsCount.set(res.numOfCartItems);
          },
        });

      this.wishlistService
        .getLoggedUserWishlist()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.wishlistService.wishlistItemsCount.set(res.count);
          },
        });
    }
  }
}
