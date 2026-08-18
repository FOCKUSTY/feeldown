import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type {
  Data,
  FriendRequest,
  User,
  FriendRequestStatus,
} from '@/server/types';
import { HttpBaseService } from './http-base.service';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class FriendService extends HttpBaseService {
  public constructor(private readonly http: HttpClient) {
    super();
  }

  public sendRequest(userId: string): Observable<FriendRequest> {
    return this.from(
      this.http.post<Data<FriendRequest>>(
        `${environment.API_ORIGIN}/api/v1/friendships`,
        {
          receiverId: userId,
        },
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public acceptRequest(friendshipId: string): Observable<FriendRequest> {
    return this.from(
      this.http.post<Data<FriendRequest>>(
        `${environment.API_ORIGIN}/api/v1/friendships/${friendshipId}?status=ACCEPTED`,
        {},
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public rejectRequest(friendshipId: string): Observable<FriendRequest> {
    return this.from(
      this.http.put<FriendRequest>(
        `${environment.API_ORIGIN}/api/v1/friendships/${friendshipId}?status=REJECTED`,
        {},
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public removeFriend(friendshipId: string): Observable<FriendRequest> {
    return this.from(
      this.http.delete<FriendRequest>(
        `${environment.API_ORIGIN}/api/v1/friendships/${friendshipId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public getFriends(): Observable<User[]> {
    return this.from(
      this.http.get<Data<User[]>>(
        `${environment.API_ORIGIN}/api/v1/friendships/.me/friends`,
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public getRequest(userId: string): Observable<FriendRequest> {
    return this.from(
      this.http.get<FriendRequest>(
        `${environment.API_ORIGIN}/api/v1/friendships/by-user/${userId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public getIncomingRequests(): Observable<FriendRequest[]> {
    return this.from(
      this.http.get<Data<FriendRequest[]>>(
        `${environment.API_ORIGIN}/api/v1/friendships?receiverId=me?status=PENDING`,
        {
          headers: this.getHeaders(),
        },
      ),
    );
  }

  public getFriendshipId(userId: string): Observable<string | null> {
    return this.from(
      this.http.get<FriendRequest>(
        `${environment.API_ORIGIN}/api/v1/friendships/by-user/${userId}`,
        {
          headers: this.getHeaders(),
        },
      ),
    ).pipe(map((request) => request.id));
  }
}
