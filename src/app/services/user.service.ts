import type { User, Data, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public getMe(token?: string | null): Observable<User | null> {
    return this.http
      .get<Data<User | null>>('/api/users/@me', {
        headers: this.getHeaders(token),
      })
      .pipe(this.from.bind(this));
  }

  public getUser(slug: string): Observable<User> {
    return this.http
      .get<Data<User>>(`/api/users/${slug}`)
      .pipe(this.from.bind(this));
  }

  public getUserPosts(slug: string): Observable<Post[]> {
    return this.http
      .get<Data<Post[]>>(`/api/users/${slug}/posts`)
      .pipe(this.from.bind(this));
  }
}
