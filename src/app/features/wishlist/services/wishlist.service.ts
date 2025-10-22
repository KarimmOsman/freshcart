import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { api_url } from '../../../core/injectable_tokens/api_url';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistItemsCount: WritableSignal<number> = signal(0);

  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private baseUrl: string
  ) {}

  addProductToWishlist(Id: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/wishlist`, {
      productId: Id,
    });
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/wishlist`);
  }

  removeSpecificWishlistItem(Id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/wishlist/${Id}`);
  }

  isProductInWishlist(productId: string): Observable<boolean> {
    return this.getLoggedUserWishlist().pipe(
      map((res: any) => res.data.some((item: any) => item.id === productId))
    );
  }
}
