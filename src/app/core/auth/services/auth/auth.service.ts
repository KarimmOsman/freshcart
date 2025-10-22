import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { api_url } from '../../../injectable_tokens/api_url';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  userData: object | null = null;
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    @Inject(api_url) private baseUrl: string
  ) {}
  Signup(data: object): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/signup`, data);
  }
  Signin(data: object): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/signin`, data);
  }
  verifyEmail(data: object): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/forgotPasswords`, data);
  }
  verifyResetCode(data: object): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/verifyResetCode`, data);
  }
  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/auth/resetPassword`, data);
  }
  sendUserData(): void {
    if (this.cookieService.check('userToken')) {
      this.userData = jwtDecode(this.cookieService.get('userToken')!);
      console.log(this.userData);
    }
  }
  signOut(): void {
    this.cookieService.delete('userToken');
    this.userData = null;
    this.router.navigate(['/login']);
  }
}
