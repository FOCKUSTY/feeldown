import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@/app/services/auth.service';
import { PostService } from '@/app/services/post.service';
import { FdButton } from '@/app/components/fd-button/fd-button.component';

@Component({
  selector: 'app-new',
  imports: [FormsModule, FdButton],
  templateUrl: './new.html',
})
export class New implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  protected readonly router = inject(Router);

  protected content = '';
  protected submitting = false;
  protected error = '';

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/']);
    }
  }

  public onSubmit(): void {
    if (!this.content.trim()) {
      this.error = 'Заголовок и содержимое не могут быть пустыми.';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.postService.create({
      content: this.content.trim(),
    }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.message || 'Ошибка при создании поста. Попробуйте позже.';
        this.submitting = false;
      },
    });
  }
}
