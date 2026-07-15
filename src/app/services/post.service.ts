import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

export interface PostCreate {
  content: string;
}

export interface Post extends PostCreate {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PostService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public create(data: PostCreate): Observable<Post> {
    return this.http.post<Post>('/api/post', data, {
      headers: this.getHeaders(),
    });
  }
}
