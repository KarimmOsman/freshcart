import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { api_url } from '../../injectable_tokens/api_url';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  userToken: any;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    @Inject(api_url) private baseUrl: string
  ) {
    this.userToken = this.cookieService.get('userToken');
  }
  checkOutSession(cartId: any, data: object): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      { shippingAddress: data }
    );
  }
  createCashOrder(cartId: any, data: object): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/orders/checkout-session/${cartId}`,
      { shippingAddress: data }
    );
  }
  getUserOrders(userId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/orders/user/${userId}`);
  }
}
