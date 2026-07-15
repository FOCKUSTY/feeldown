import type { ClientPost } from '@/server/types';

import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { Subscription, switchMap } from 'rxjs';

import { PostService } from '@/app/services';
import { FdButton } from '@/app/components';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MarkdownComponent, FdButton],
  templateUrl: './post.html',
})
export class Post implements OnInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  protected readonly _post = signal<ClientPost | null>(null);
  protected readonly _loaded = signal<boolean>(false);
  protected readonly _error = signal<string | null>(null);

  private _subscription = new Subscription();

  public ngOnInit(): void {
    this._subscription = this._route.params
      .pipe(
        switchMap((params) => {
          const id = params['id'];
          if (!id) {
            this._router.navigate(['/']);
            return [];
          }

          this._error.set(null);
          return this.postService.get(id);
        }),
      )
      .subscribe({
        next: (post) => {
          this._post.set(post);
          this._loaded.set(true);
        },
        error: (err) => {
          this._error.set(err.message || 'Не удалось загрузить пост.');
          this._loaded.set(true);
        },
      });
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public goBack(): void {
    this._router.navigate(['/']);
  }
}
