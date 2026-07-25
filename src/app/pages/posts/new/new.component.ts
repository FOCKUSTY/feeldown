import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MarkdownComponent } from 'ngx-markdown';

import { PostService, AuthService } from '@/app/services';
import { FdButton } from '@/app/components';
import { TEST_MARKDOWN } from '@/app/constants';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-new',
  imports: [FormsModule, FdButton, MarkdownComponent],
  templateUrl: './new.html',
})
export class New {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  protected readonly router = inject(Router);

  protected title = '';
  protected postname = uuid();
  protected content = TEST_MARKDOWN;

  protected _submitting = signal<boolean>(false);
  protected _error = signal<string | null>(null);

  public constructor() {}

  public ngAfterInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/']);
    }
  }

  public onSubmit(): void {
    if (!this.title.trim() || !this.content.trim()) {
      this._error.set('Заголовок и содержимое обязательны.');
      return;
    }

    this._submitting.set(true);
    this._error.set(null);

    this.postService
      .create({
        title: this.title.trim(),
        postname: this.postname.trim(),
        content: this.content.trim(),
      })
      .subscribe({
        next: (post) => {
          this.router.navigate([`/posts/${post.id}`]);
        },
        error: (err) => {
          this._error.set(
            err.error?.error || 'Ошибка при создании поста. Попробуйте позже.',
          );
          this._submitting.set(false);
        },
      });
  }
}
