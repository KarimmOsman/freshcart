import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../injectable_tokens/api_url';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private baseUrl: string
  ) {}

  getAllProducts(pageNumber: number = 1): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/products?page=${pageNumber}`);
  }
}
