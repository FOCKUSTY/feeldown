import type { ClientPost } from '@/server/types';

import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

import { PostCreate, PostService } from '@/app/services';
import { FdButton } from '@/app/components';

@Component({
  selector: 'app-edit-post',
  imports: [FormsModule, FdButton, MarkdownComponent],
  templateUrl: './edit.html',
})
export class EditPost implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _service = inject(PostService);

  protected title = '';
  protected postname = '';
  protected content = '';

  protected _submitting = signal(false);
  protected _error = signal<string | null>(null);
  protected _loaded = signal(false);
  protected _slug: string | null = null;

  public ngOnInit(): void {
    const slug = this._route.snapshot.paramMap.get('slug');
    if (!slug) {
      this._router.navigate(['/']);
      return;
    }
    this._slug = slug;

    this._service.get(slug).subscribe({
      next: (post: ClientPost) => {
        this.title = post.title;
        this.postname = post.postname;
        this.content = post.content;
        this._loaded.set(true);
        if (post.isAuthor === false) {
          this._router.navigate(['/posts', slug]);
        }
      },
      error: () => {
        this._error.set('Не удалось загрузить пост');
        this._loaded.set(true);
      },
    });
  }

  public onSubmit(): void {
    if (!this.content.trim() || !this.title.trim() || !this.postname.trim()) {
      this._error.set('Содержимое не может быть пустым.');
      return;
    }

    if (!this._slug) return;

    this._submitting.set(true);
    this._error.set(null);

    const post: PostCreate = {
      title: this.title.trim(),
      postname: this.postname.trim(),
      content: this.content.trim(),
    };

    this._service.update(this._slug, post).subscribe({
      next: (updated) => {
        this._router.navigate(['/posts', updated.postname]);
      },
      error: (err) => {
        this._error.set(err.message || 'Ошибка при обновлении поста.');
        this._submitting.set(false);
      },
    });
  }

  public cancel(): void {
    if (this._slug) {
      this._router.navigate(['/posts', this._slug]);
    } else {
      this._router.navigate(['/']);
    }
  }
}
