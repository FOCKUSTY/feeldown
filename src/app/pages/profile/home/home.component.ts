import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UserService } from '@/app/services';
import { BaseUserComponent } from '@/app/components';
import type { User, Post } from '@/server/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [BaseUserComponent],
  templateUrl: './home.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);

  protected _user = signal<User | null>(null);
  protected _posts = signal<Post[]>([]);
  protected _loading = signal(true);
  protected _error = signal<string | null>(null);
  protected _currentUserId = signal<string | null>(null);

  private _subscription = new Subscription();

  public ngOnInit(): void {
    this._subscription = of(null)
      .pipe(
        switchMap(() => {
          this._loading.set(true);
          this._error.set(null);
          return forkJoin({
            user: this._userService.getMe().pipe(catchError(() => of(null))),
            posts: this._userService
              .getUserPosts('.me')
              .pipe(catchError(() => of([]))),
          });
        }),
      )
      .subscribe({
        next: ({ user, posts }) => {
          if (!user) {
            this._error.set('Пользователь не найден');
            this._loading.set(false);
            return;
          }

          this._user.set(user);
          this._posts.set(posts);
          this._currentUserId.set(user.id);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err.message || 'Не удалось загрузить профиль');
          this._loading.set(false);
        },
      });
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
}
