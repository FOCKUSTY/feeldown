import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

export interface Notification {
  id: string;
  type: string;
  referenceType: string;
  referenceId: string;
  readed: boolean;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http: HttpClient;
  private readonly router: Router;
  private readonly unreadCountSubject: BehaviorSubject<number>;

  public constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
    this.unreadCountSubject = new BehaviorSubject<number>(0);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.refreshUnreadCount();
      });
  }

  public get unreadCount$(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  public refreshUnreadCount(): void {
    this.http
      .get<{ data: { count: number } }>('/api/notifications/unread-count')
      .subscribe({
        next: (response) => {
          this.unreadCountSubject.next(response.data.count);
        },
        error: () => {
          this.unreadCountSubject.next(0);
        },
      });
  }

  public getList(
    page: number,
    limit: number,
  ): Observable<{
    data: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }> {
    return this.http.get<{
      data: Notification[];
      pagination: {
        page: number;
        limit: number;
        total: number;
      };
    }>(`/api/notifications?page=${page}&limit=${limit}`);
  }

  public markAsRead(id: string): Observable<unknown> {
    return this.http.put(`/api/notifications/${id}/read`, {});
  }

  public markAllAsRead(): Observable<unknown> {
    return this.http.put('/api/notifications/read-all', {});
  }
}
