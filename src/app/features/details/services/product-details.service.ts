import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../../core/injectable_tokens/api_url';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private baseUrl: string
  ) {}

  getSpecificProduct(id: string | null): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/products/${id}`);
  }
}
