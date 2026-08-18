import type { ClientNotification } from '@/server/types';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { HttpBaseService } from './http-base.service';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends HttpBaseService {
  private readonly http: HttpClient;
  private readonly router: Router;
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);

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
      .get<{ count: number }>(
        `${environment.API_ORIGIN}/api/v1/notifications/count`,
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: (response) => {
          this.unreadCountSubject.next(response.count);
        },
        error: () => {
          this.unreadCountSubject.next(0);
        },
      });
  }

  public getList(
    limit: number = 20,
    sort: 'asc' | 'desc' = 'desc',
    sortBy: string = 'createdAt',
    cursor?: string,
    filters?: Partial<{
      actorId: string;
      referenceType: string;
      referenceId: string;
      readed: boolean;
      type: string;
    }>,
  ): Observable<{ data: ClientNotification[]; nextCursor: string | null }> {
    let params: any = { limit, sort, sortBy };
    if (cursor) params.cursor = cursor;
    if (filters) {
      Object.assign(params, filters);
    }

    return this.http
      .get<ClientNotification[]>(
        `${environment.API_ORIGIN}/api/v1/notifications`,
        {
          headers: this.getHeaders(),
          params,
        },
      )
      .pipe(
        map((response) => {
          const hasMore = response.length === limit;
          const nextCursor = hasMore ? response[response.length - 1]?.id : null;
          return { data: response, nextCursor };
        }),
      );
  }

  public markAsRead(id: string): Observable<unknown> {
    return this.http.put(
      `${environment.API_ORIGIN}/api/v1/notifications/${id}?action=read`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  public markAllAsRead(): Observable<unknown> {
    return this.http.put(
      `${environment.API_ORIGIN}/api/v1/notifications?action=read`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}
