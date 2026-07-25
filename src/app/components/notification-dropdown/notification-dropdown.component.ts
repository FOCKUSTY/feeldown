import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  Notification,
  NotificationService,
} from '@/app/services/notification.service';

@Component({
  selector: 'notification-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification-dropdown.html',
})
export class NotificationDropdown implements OnInit, OnDestroy {
  private readonly _service = inject(NotificationService);
  private readonly _ref = inject(ElementRef);
  private readonly _subscription = new Subscription();

  protected readonly _opened = signal(false);
  protected readonly _loading = signal(false);
  protected readonly _notifications = signal<Notification[]>([]);
  protected readonly _unread_count = signal(0);

  protected readonly _page = signal(1);
  protected readonly _limit = 10;
  protected readonly _total = signal(0);
  protected readonly _total_pages = computed(() =>
    Math.ceil(this._total() / this._limit),
  );

  protected readonly _all_read = computed(
    () =>
      this._notifications().length > 0 &&
      this._notifications().every((n) => n.readed),
  );

  protected readonly Math = Math;

  public ngOnInit(): void {
    this._subscription.add(
      this._service.unreadCount$.subscribe((count) => {
        this._unread_count.set(count);
      }),
    );
    this.loadPage(1);
    this._service.refreshUnreadCount();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  protected toggleDropdown(): void {
    this._opened.update((v) => !v);
    if (this._opened()) {
      this.loadPage(1);
      this._service.refreshUnreadCount();
    }
  }

  protected loadPage(page: number): void {
    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    this._service.getList(page, this._limit).subscribe({
      next: (response) => {
        this._notifications.set(response.data);
        this._total.set(response.pagination.total);
        this._page.set(page);
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
        const current = this._notifications();
        const updated = current.map((notification) =>
          notification.id === id
            ? { ...notification, readed: true }
            : notification,
        );
        this._notifications.set(updated);
        this._service.refreshUnreadCount();
      },
    });
  }

  protected markAllRead(): void {
    if (this._all_read()) {
      return;
    }

    this._service.markAllAsRead().subscribe({
      next: () => {
        const updated = this._notifications().map((notification) => ({
          ...notification,
          readed: true,
        }));
        this._notifications.set(updated);
        this._service.refreshUnreadCount();
      },
    });
  }

  protected getMessage(notification: Notification): string {
    const actor = notification.actor?.name || 'Кто-то';
    const messageMap: Record<string, string> = {
      REACT_POST: `${actor} поставил(а) реакцию на ваш пост`,
      COMMENT_POST: `${actor} прокомментировал(а) ваш пост`,
      REPLY_COMMENT: `${actor} ответил(а) на ваш комментарий`,
      FRIEND_REQUEST: `${actor} отправил(а) запрос в друзья`,
      FRIEND_ACCEPT: `${actor} принял(а) запрос в друзья`,
    };

    return messageMap[notification.type] || 'Новое уведомление';
  }

  protected onNotificationClick(notification: Notification): void {
    if (!notification.readed) {
      this.markRead(notification.id);
    }

    this._opened.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this._ref.nativeElement.contains(target)) {
      this._opened.set(false);
    }
  }
}
