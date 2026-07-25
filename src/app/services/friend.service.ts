import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Data, Friendship, User } from '@/server/types';
import { HttpBaseService } from './http-base.service';

export type FriendshipStatus =
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'friends'
  | 'self';

@Injectable({ providedIn: 'root' })
export class FriendService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public sendRequest(userId: string): Observable<Friendship> {
    return this.from(
      this.http.post<Data<Friendship>>(
        `/api/friends/request/${userId}`,
        {},
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public acceptRequest(friendshipId: string): Observable<Friendship> {
    return this.from(
      this.http.post<Data<Friendship>>(
        `/api/friends/accept/${friendshipId}`,
        {},
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public rejectRequest(friendshipId: string): Observable<{ success: boolean }> {
    return this.from(
      this.http.post<Data<{ success: boolean }>>(
        `/api/friends/reject/${friendshipId}`,
        {},
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public removeFriend(friendshipId: string): Observable<{ success: boolean }> {
    return this.from(
      this.http.delete<Data<{ success: boolean }>>(
        `/api/friends/${friendshipId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public getFriends(): Observable<User[]> {
    return this.from(
      this.http.get<Data<User[]>>('/api/friends', {
        headers: this.getHeaders(),
      }),
    );
  }

  public getStatus(userId: string): Observable<FriendshipStatus> {
    return this.from(
      this.http.get<Data<{ status: FriendshipStatus }>>(
        `/api/friends/status/${userId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    ).pipe(map((res) => res.status));
  }

  public getIncomingRequests(): Observable<Friendship[]> {
    return this.from(
      this.http.get<Data<Friendship[]>>('/api/friends/incoming', {
        headers: this.getHeaders(),
      }),
    );
  }

  public getOutgoingRequests(): Observable<Friendship[]> {
    return this.from(
      this.http.get<Data<Friendship[]>>('/api/friends/outgoing', {
        headers: this.getHeaders(),
      }),
    );
  }

  public getFriendshipId(userId: string): Observable<string | null> {
    return this.from(
      this.http.get<Data<{ friendshipId: string | null }>>(
        `/api/friends/friendship-id/${userId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    ).pipe(map((res) => res.friendshipId));
  }
}
