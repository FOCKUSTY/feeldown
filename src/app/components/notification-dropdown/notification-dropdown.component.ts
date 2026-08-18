import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '@/app/services/notification.service';
import { ClientNotification } from '@/server/types';
import { Router } from '@angular/router';

@Component({
  selector: 'notification-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-dropdown.html',
})
export class NotificationDropdown implements OnInit, OnDestroy {
  private readonly _router = inject(Router);

  private readonly _service = inject(NotificationService);
  private readonly _ref = inject(ElementRef);
  private readonly _subscription = new Subscription();

  protected readonly _opened = signal(false);
  protected readonly _loading = signal(false);
  protected readonly _notifications = signal<ClientNotification[]>([]);
  protected readonly _unread_count = signal(0);

  private readonly _limit = 10;
  protected _has_more = true;
  private _cursor: string | null = null;

  protected readonly _all_read = signal(false);

  public ngOnInit(): void {
    this._subscription.add(
      this._service.unreadCount.subscribe((count) =>
        this._unread_count.set(count),
      ),
    );
    this.loadNextPage();
    this._service.refreshUnreadCount();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  protected toggleDropdown(): void {
    this._opened.update((v) => !v);
    if (this._opened()) {
      this._notifications.set([]);
      this._cursor = null;
      this._has_more = true;
      this.loadNextPage();
      this._service.refreshUnreadCount();
    }
  }

  protected loadNextPage(): void {
    if (this._loading() || !this._has_more) return;

    this._loading.set(true);
    this._service
      .getList(this._limit, 'desc', 'createdAt', this._cursor || undefined)
      .subscribe({
        next: ({ data, nextCursor }) => {
          this._notifications.update((current) => [...current, ...data]);
          this._cursor = nextCursor;
          this._has_more = !!nextCursor;
          this._all_read.set(this._notifications().every((n) => n.readed));
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        },
      });
  }

  protected markRead(id: string): void {
    this._service.markAsRead(id).subscribe({
      next: () => {
        this._notifications.update((items) =>
          items.map((n) => (n.id === id ? { ...n, readed: true } : n)),
        );
        this._all_read.set(this._notifications().every((n) => n.readed));
        this._service.refreshUnreadCount();
      },
    });
  }

  protected markAllRead(): void {
    if (this._all_read()) return;
    this._service.markAllAsRead().subscribe({
      next: () => {
        this._notifications.update((items) =>
          items.map((n) => ({ ...n, readed: true })),
        );
        this._all_read.set(true);
        this._service.refreshUnreadCount();
      },
    });
  }

  protected getMessage(notification: ClientNotification): string {
    const actor = notification.actor?.nickname || 'Кто-то';
    const map: Record<string, string> = {
      REACT_POST: `${actor} поставил(а) реакцию на ваш пост`,
      COMMENT_POST: `${actor} прокомментировал(а) ваш пост`,
      REPLY_COMMENT: `${actor} ответил(а) на ваш комментарий`,
      FRIEND_REQUEST: `${actor} отправил(а) запрос в друзья`,
      FRIEND_ACCEPT: `${actor} принял(а) запрос в друзья`,
      FOLLOW: `${actor} подписался(ась) на вас`,
      CREATE_POST: `${actor} опубликовал(а) новый пост`,
    };
    return map[notification.type] || 'Новое уведомление';
  }

  protected onNotificationClick(notification: ClientNotification): void {
    if (!notification.readed) this.markRead(notification.id);
    if (notification.type === 'FRIEND_REQUEST') {
      this._router.navigate(['/users', `.${notification.actor.username}`]);
    }
    this._opened.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this._ref.nativeElement.contains(event.target)) {
      this._opened.set(false);
    }
  }
}
