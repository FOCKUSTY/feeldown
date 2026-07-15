import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { UserService } from '@/app/services';
import { User, Post } from '@/server/types';
import { FdButton } from '@/app/components';

@Component({
  selector: 'app-user-user',
  standalone: true,
  imports: [CommonModule, FdButton, RouterLink],
  templateUrl: './user.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly userService = inject(UserService);

  protected readonly _user = signal<User | null>(null);
  protected readonly _posts = signal<Post[]>([]);
  protected readonly _loading = signal<boolean>(true);
  protected readonly _error = signal<string | null>(null);

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
          this._loading.set(true);
          this._error.set(null);

          return forkJoin({
            user: this.userService
              .getUser(slug)
              .pipe(catchError(() => of(null))),
            posts: this.userService
              .getUserPosts(slug)
              .pipe(catchError(() => of([]))),
          });
        }),
      )
      .subscribe({
        next: (result) => {
          if (!result) {
            this._loading.set(false);
            return
          }

          if (!result.user) {
            this._error.set('Пользователь не найден');
          } else {
            this._user.set(result.user);
            this._posts.set(result.posts);
          }
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err.message || 'Ошибка загрузки данных');
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
}
