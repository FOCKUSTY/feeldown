import type { ClientPost } from '@/server/types';

import { Component, inject, signal, OnInit, OnDestroy, TransferState, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { Subscription, switchMap } from 'rxjs';

import { PostService } from '@/app/services';
import { FdButton } from '@/app/components';
import { Meta, Title } from '@angular/platform-browser';

const POST_KEY = makeStateKey<ClientPost>('post');

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MarkdownComponent, FdButton],
  templateUrl: './post.html',
})
export class Post implements OnInit, OnDestroy {
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _transfer_state = inject(TransferState);

  private readonly _post_service = inject(PostService);
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
          return this._post_service.get(id);
        }),
      )
      .subscribe({
        next: (post) => {
          this._post.set(post);
          this.updateMetaTags(post);
          this._transfer_state.set(POST_KEY, post);
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

  public goToEdit(): void {
    const post = this._post();
    if (post) {
      this._router.navigate(['/posts', post.id, 'edit']);
    }
  }

  public goBack(): void {
    this._router.navigate(['/']);
  }

  private updateMetaTags(post: ClientPost): void {
    const title = `${post.user.name} — Feeldown`;
    this._title.setTitle(title);

    const description = post.content.slice(0, 160) + (post.content.length > 160 ? '…' : '');

    this._meta.updateTag({ name: 'description', content: description });
    this._meta.updateTag({ property: 'og:title', content: title });
    this._meta.updateTag({ property: 'og:description', content: description });

    const url = `https://feeldown.vercel.app/posts/${post.id}`;
    this._meta.updateTag({ property: 'og:url', content: url });
    this._meta.updateTag({ property: 'og:type', content: 'article' });

    this._meta.updateTag({ property: 'og:image', content: 'https://feeldown.vercel.app/og-image.png' });
    this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this._meta.updateTag({ name: 'twitter:title', content: title });
    this._meta.updateTag({ name: 'twitter:description', content: description });
    this._meta.updateTag({ name: 'twitter:image', content: 'https://feeldown.vercel.app/og-image.png' });
  }
}
