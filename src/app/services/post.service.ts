import type { Data, Post } from '@/server/types';
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

  public get(id: string): Observable<Post> {
    const data = this.http.get<Data<Post>>(`/api/posts/${id}`);
    return this.from(data);
  }

  public create(post: PostCreate): Observable<Post> {
    const data = this.http.post<Data<Post>>('/api/posts', post, {
      headers: this.getHeaders(),
    });

    return this.from(data);
  }
}
