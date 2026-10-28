import type { Data, ClientPost, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

import { compressToBase64 } from 'lz-string';

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
    const data = this.http.get<Data<ClientPost>>(`/api/posts/${slug}`, {
      headers: this.getHeaders(),
    });

    return this.decompress(this.from(data), 'content');
  }

  public update(slug: string, post: PostCreate): Observable<Post> {
    const data = this.http.put<Data<Post>>(
      `/api/posts/${slug}`,
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
    const data = this.http.post<Data<Post>>(
      '/api/posts',
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
}
