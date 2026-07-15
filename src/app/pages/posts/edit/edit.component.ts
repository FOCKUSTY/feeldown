import type { ClientPost } from '@/server/types';

import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

import { PostService } from '@/app/services';
import { FdButton } from '@/app/components';

@Component({
  selector: 'app-edit-post',
  imports: [FormsModule, FdButton, MarkdownComponent],
  templateUrl: './edit.html',
})
export class EditPost implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  protected content = '';
  protected _submitting = signal(false);
  protected _error = signal<string | null>(null);
  protected _loaded = signal(false);
  protected _postId: string | null = null;

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }
    this._postId = id;

    this.postService.get(id).subscribe({
      next: (post: ClientPost) => {
        this.content = post.content;
        this._loaded.set(true);
        // Проверка авторства: если isAuthor === false, перенаправляем
        if (post.isAuthor === false) {
          this.router.navigate(['/posts', id]);
        }
      },
      error: () => {
        this._error.set('Не удалось загрузить пост');
        this._loaded.set(true);
      },
    });
  }

  public onSubmit(): void {
    if (!this.content.trim()) {
      this._error.set('Содержимое не может быть пустым.');
      return;
    }

    if (!this._postId) return;

    this._submitting.set(true);
    this._error.set(null);

    this.postService.update(this._postId, this.content.trim()).subscribe({
      next: (updated) => {
        this.router.navigate(['/posts', updated.id]);
      },
      error: (err) => {
        this._error.set(err.message || 'Ошибка при обновлении поста.');
        this._submitting.set(false);
      },
    });
  }

  public cancel(): void {
    if (this._postId) {
      this.router.navigate(['/posts', this._postId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
