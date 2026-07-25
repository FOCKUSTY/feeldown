import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { HttpBaseService } from './http-base.service';
import { Data, ClientNotification } from '@/server/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends HttpBaseService {
  private readonly http: HttpClient;
  private readonly router: Router;
  private readonly unreadCountSubject: BehaviorSubject<number>;

  public constructor(http: HttpClient, router: Router) {
    super();

    this.http = http;
    this.router = router;
    this.unreadCountSubject = new BehaviorSubject<number>(0);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.refreshUnreadCount();
      });
  }

  public get unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  public refreshUnreadCount(): void {
    this.http
      .get<{ data: number }>('/api/notifications/unread-count', {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (response) => {
          this.unreadCountSubject.next(response.data);
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
    data: ClientNotification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }> {
    const data = this.http.get<
      Data<{
        data: ClientNotification[];
        pagination: {
          page: number;
          limit: number;
          total: number;
        };
      }>
    >(`/api/notifications?page=${page}&limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.from(data);
  }

  public markAsRead(id: string): Observable<unknown> {
    return this.http.put(
      `/api/notifications/${id}/read`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  public markAllAsRead(): Observable<unknown> {
    return this.http.put(
      '/api/notifications/read-all',
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}
