import type { User, Data, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { compressToBase64, decompressFromBase64 } from 'lz-string';

@Injectable({ providedIn: 'root' })
export class UserService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public getMe(token?: string | null): Observable<User | null> {
    const data = this.http.get<Data<User | null>>('/api/users/@me', {
      headers: this.getHeaders(token),
    });

    return this.decompress(this.from(data), 'description');
  }

  public getUser(slug: string): Observable<User | null> {
    const data = this.http.get<Data<User>>(`/api/users/${slug}`);
    return this.decompress(this.from(data), 'description');
  }

  public getUserPosts(slug: string, token?: string | null): Observable<Post[]> {
    const data = this.http.get<Data<Post[]>>(`/api/users/${slug}/posts`, {
      headers: this.getHeaders(token),
    });

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
      name: string | null;
      description: string | null;
      username: string | null;
    }>,
  ): Observable<User> {
    const description = data.description
      ? { description: compressToBase64(data.description) }
      : {};

    const updated = this.http.put<Data<User>>(
      '/api/users/@me',
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
