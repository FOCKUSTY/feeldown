import type { ClientPost } from '@/server/types';

import { Component, inject, signal, OnInit, TransferState, makeStateKey } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

import { FdButton } from '@/app/components';

const POST_KEY = makeStateKey<ClientPost>('post');

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MarkdownComponent, FdButton],
  templateUrl: './post.html',
})
export class Post implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _transfer_state = inject(TransferState);

  protected readonly _post = signal<ClientPost | null>(null);
  protected readonly _loaded = signal<boolean>(false);
  protected readonly _error = signal<string | null>(null);

  public ngOnInit(): void {
    const post = this._route.snapshot.data['post'] as ClientPost;

    if (post) {
      this._post.set(post);
      this._transfer_state.set(POST_KEY, post);
    } else {
      this._error.set('Пост не найден');
    }

    this._loaded.set(true);
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
}
