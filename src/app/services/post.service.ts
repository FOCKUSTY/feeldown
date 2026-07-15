import type { Data, ClientPost, Post } from '@/server/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

export interface PostCreate {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class PostService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public get(id: string): Observable<ClientPost> {
    const data = this.http.get<Data<ClientPost>>(`/api/posts/${id}`, {
      headers: this.getHeaders(),
    });
    return this.from(data);
  }

  public update(id: string, content: string): Observable<Post> {
    const data = this.http.put<Data<Post>>(
      `/api/posts/${id}`,
      { content },
      {
        headers: this.getHeaders(),
      },
    );
    return this.from(data);
  }

  public create(post: PostCreate): Observable<Post> {
    const data = this.http.post<Data<Post>>('/api/posts', post, {
      headers: this.getHeaders(),
    });

    return this.from(data);
  }
}
