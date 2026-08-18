import type { User, Data, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public getMe(token?: string | null): Observable<User | null> {
    return this.http
      .get<User | null>(`${environment.API_ORIGIN}/api/v1/users/.me`, {
        headers: this.getHeaders(token),
      })
      .pipe(
        switchMap((user) =>
          of(
            this.decompressBase<User | null, 'description'>(
              user,
              'description',
            ),
          ),
        ),
        catchError((error) => {
          if ('status' in error) {
            console.error(error);
            if (error.status === 401) {
              return of(null);
            }
          }

          throw error;
        }),
      );
  }

  public getUser(slug: string): Observable<User | null> {
    const user = this.http.get<User>(
      `${environment.API_ORIGIN}/api/v1/users/${slug}`,
    );
    return this.decompress(user, 'description');
  }

  public getUserPosts(slug: string, token?: string | null): Observable<Post[]> {
    const data = this.http.get<Data<Post[]>>(
      `${environment.API_ORIGIN}/api/v1/users/${slug}/posts`,
      {
        headers: this.getHeaders(token),
      },
    );

    return this.from(data).pipe(
      map((posts) =>
        posts.map((post) => ({
          ...post,
          content: decompressFromBase64(post.content),
        })),
      ),
    );
  }

  public updateProfile(
    data: Partial<{
      nickname: string | null;
      description: string | null;
      username: string | null;
    }>,
  ): Observable<User> {
    const description = data.description
      ? { description: compressToBase64(data.description) }
      : {};

    const updated = this.http.put<Data<User>>(
      `${environment.API_ORIGIN}/api/v1/users/.me`,
      {
        ...data,
        ...description,
      },
      {
        headers: this.getHeaders(),
      },
    );

    return this.decompress(this.from(updated), 'description');
  }
}
