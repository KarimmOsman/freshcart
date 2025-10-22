import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../../core/injectable_tokens/api_url';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemsCount: WritableSignal<number> = signal(0);

  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private baseUrl: string
  ) {}

  addProductToCart(Id: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/cart`, {
      productId: Id,
    });
  }

  updateCartProductQuantity(Id: string, newCount: number): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/cart/${Id}`, {
      count: newCount,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/cart`);
  }

  removeSpecificCartItem(Id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/cart/${Id}`);
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/cart`);
  }
}
