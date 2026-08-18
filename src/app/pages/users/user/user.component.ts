import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of, switchMap, catchError } from 'rxjs';

import { BaseUserComponent } from '@/app/components';
import { UserService, FriendService } from '@/app/services';
import type { User, Post, FriendRequest } from '@/server/types';

@Component({
  selector: 'app-user-user',
  standalone: true,
  imports: [BaseUserComponent],
  templateUrl: './user.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);
  private readonly _friendService = inject(FriendService);

  protected _user = signal<User | null>(null);
  protected _posts = signal<Post[]>([]);
  protected _is_me = signal(false);
  protected _loading = signal(true);
  protected _error = signal<string | null>(null);
  protected _friendship_request = signal<FriendRequest | null>(null);
  protected _friendship_id = signal<string | null>(null);
  protected _current_user_id = signal<string | null>(null);

  private _subscription = new Subscription();

  public ngOnInit(): void {
    this._subscription.add(
      this._route.params
        .pipe(
          switchMap((params) => {
            const slug = params['slug'];
            if (!slug) {
              this._router.navigate(['/']);
              return of(null);
            }
            this._error.set(null);
            this._loading.set(true);

            return forkJoin({
              user: this._userService
                .getUser(slug)
                .pipe(catchError(() => of(null))),
              posts: this._userService
                .getUserPosts(slug)
                .pipe(catchError(() => of([]))),
              me: this._userService.getMe().pipe(catchError(() => of(null))),
            });
          }),
          switchMap((result) => {
            if (!result) {
              this._loading.set(false);
              return of(null);
            }

            const { user, posts, me } = result;
            if (!user) {
              this._error.set('Пользователь не найден');
              this._loading.set(false);
              return of(null);
            }

            this._user.set(user);
            this._posts.set(posts);
            this._is_me.set(!!me && me.id === user.id);
            this._current_user_id.set(me?.id || null);

            if (me && me.id !== user.id) {
              return this._friendService
                .getRequest(user.id)
                .pipe(catchError(() => of(null)));
            } else {
              return of(null);
            }
          }),
        )
        .subscribe({
          next: (status) => {
            if (status) {
              this._friendship_request.set(status);
            }
            this._loading.set(false);
          },
          error: (err) => {
            this._error.set(err.message || 'Ошибка загрузки данных');
            this._loading.set(false);
          },
        }),
    );
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  protected goBack(): void {
    this._router.navigate(['/']);
  }

  protected navigateToEdit(): void {
    this._router.navigate(['/profile/edit']);
  }

  protected sendFriendRequest(): void {
    const user = this._user();
    if (!user) return;

    this._friendService.sendRequest(user.id).subscribe({
      next: (friendship) => {
        this._friendship_request.set(friendship);
        this._friendship_id.set(friendship.id);
      },
      error: (err) => {
        this._error.set(err.error?.error || 'Не удалось отправить запрос');
      },
    });
  }

  protected acceptFriendRequest(): void {
    const user = this._user();
    if (!user) return;

    this._subscription.add(
      this._friendService.getIncomingRequests().subscribe({
        next: (requests) => {
          const request = requests.find((f) => f.senderId === user.id);
          if (!request) {
            this._error.set('Запрос не найден');
            return;
          }

          this._subscription.add(
            this._friendService.acceptRequest(request.id).subscribe({
              next: (friendship) => {
                this._friendship_request.set(friendship);
                this._friendship_id.set(request.id);
              },
              error: (err) => {
                this._error.set(
                  err.error?.error || 'Не удалось принять запрос',
                );
              },
            }),
          );
        },
        error: () => {
          this._error.set('Не удалось загрузить входящие запросы');
        },
      }),
    );
  }

  protected rejectFriendRequest(): void {
    const user = this._user();
    if (!user) return;

    this._subscription.add(
      this._friendService.getIncomingRequests().subscribe({
        next: (requests) => {
          const request = requests.find((f) => f.senderId === user.id);
          if (!request) {
            this._error.set('Запрос не найден');
            return;
          }

          this._subscription.add(
            this._friendService.rejectRequest(request.id).subscribe({
              next: (friendship) => {
                this._friendship_request.set(friendship);
                this._friendship_id.set(null);
              },
              error: (err) => {
                this._error.set(
                  err.error?.error || 'Не удалось отклонить запрос',
                );
              },
            }),
          );
        },
        error: () => {
          this._error.set('Не удалось загрузить входящие запросы');
        },
      }),
    );
  }

  protected removeFriend(): void {
    const user = this._user();
    if (!user) return;

    this._subscription.add(
      this._friendService.getFriendshipId(user.id).subscribe({
        next: (friendshipId) => {
          if (!friendshipId) {
            this._error.set('Вы не друзья');
            return;
          }

          this._subscription.add(
            this._friendService.removeFriend(friendshipId).subscribe({
              next: () => {
                this._friendship_request.set(null);
                this._friendship_id.set(null);
              },
              error: (err) => {
                this._error.set(
                  err.error?.error || 'Не удалось удалить из друзей',
                );
              },
            }),
          );
        },
        error: () => {
          this._error.set('Не удалось проверить статус дружбы');
        },
      }),
    );
  }
}
