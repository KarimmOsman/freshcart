import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../injectable_tokens/api_url';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private baseUrl: string
  ) {}

  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/categories`);
  }

  getSpecificCategory(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/categories/${id}`);
  }
}
