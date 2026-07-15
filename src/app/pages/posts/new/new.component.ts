import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MarkdownComponent } from 'ngx-markdown';

import { PostService, AuthService } from '@/app/services';
import { FdButton } from '@/app/components';
import { TEST_MARKDOWN } from '@/app/constants';

@Component({
  selector: 'app-new',
  imports: [FormsModule, FdButton, MarkdownComponent],
  templateUrl: './new.html',
})
export class New {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  protected readonly router = inject(Router);

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
    if (!this.content.trim()) {
      this._error.set('Содержимое не может быть пустым.');
      return;
    }

    this._submitting.set(true);
    this._error.set(null);

    this.postService
      .create({
        content: this.content.trim(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this._error.set(
            err.message || 'Ошибка при создании поста. Попробуйте позже.',
          );
          this._submitting.set(false);
        },
      });
  }
}
