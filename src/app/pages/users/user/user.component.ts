import type { Post, User } from '@/server/types';

import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BaseUserComponent } from '@/app/components';
import { UserService } from '@/app/services';

@Component({
  selector: 'app-user-user',
  standalone: true,
  imports: [BaseUserComponent],
  templateUrl: './user.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _service = inject(UserService);

  protected _user = signal<User | null>(null);
  protected _posts = signal<Post[]>([]);
  protected _is_me = signal(false);
  protected _loading = signal(true);
  protected _error = signal<string | null>(null);

  private _subscription = new Subscription();

  public ngOnInit() {
    this._subscription = this._route.params
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
            user: this._service.getUser(slug).pipe(catchError(() => of(null))),
            posts: this._service
              .getUserPosts(slug)
              .pipe(catchError(() => of([]))),
            me: this._service.getMe().pipe(catchError(() => of(null))),
          });
        }),
      )
      .subscribe({
        next: (result) => {
          if (!result) {
            this._loading.set(false);
            return;
          }

          const { user, posts, me } = result;
          if (!user) {
            this._error.set('Пользователь не найден');
          } else {
            this._user.set(user);
            this._posts.set(posts);
            this._is_me.set(!!me && me.id === user.id);
          }
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err.message || 'Ошибка загрузки данных');
          this._loading.set(false);
        },
      });
  }

  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  protected goBack() {
    this._router.navigate(['/']);
  }

  protected navigateToEdit() {
    this._router.navigate(['/profile/edit']);
  }
}
