import type { Data, ClientPost, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpBaseService } from './http-base.service';

import { compressToBase64 } from 'lz-string';
import { environment } from '@/environments/environment';

export interface PostCreate {
  postname: string;
  content: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class PostService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public get(slug: string): Observable<ClientPost> {
    const data = this.http.get<Data<ClientPost>>(
      `${environment.API_ORIGIN}/api/v1/posts/${slug}`,
      {
        headers: this.getHeaders(),
      },
    );

    return this.decompress(this.from(data), 'content');
  }

  public update(slug: string, post: PostCreate): Observable<Post> {
    const data = this.http.put<Data<Post>>(
      `${environment.API_ORIGIN}/api/v1/posts/${slug}`,
      {
        ...post,
        content: compressToBase64(post.content),
      },
      {
        headers: this.getHeaders(),
      },
    );

    return this.decompress(this.from(data), 'content');
  }

  public create(post: PostCreate): Observable<Post> {
    return this.http
      .post<Data<Post>>(
        `${environment.API_ORIGIN}/api/v1/posts`,
        {
          ...post,
          content: compressToBase64(post.content),
        },
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        switchMap((value) => of(this.decompressBase(value, 'content'))),
        catchError((error) => {
          console.error(error);
          throw error;
        }),
      );

    // return this.decompressBase(data, 'content');
  }
}
