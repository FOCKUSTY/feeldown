import { CookieService } from 'ngx-cookie-service';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly cookie = inject(CookieService);

  public constructor() {}

  public getToken(): string | null {
    return this.cookie.get('token') || null;
  }

  public setToken(token: string): void {
    this.cookie.set('token', token);
  }
}
