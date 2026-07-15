import type { User, Data } from '@/server/types';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public getMe(token?: string | null) {
    const data = this.http.get<Data<User | null>>('/api/users/@me', {
      responseType: 'json',
      headers: this.getHeaders(token),
    });

    return this.from(data);
  }
}
