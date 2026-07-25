import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@/app/services';
import { FdButton } from '@/app/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FdButton],
  templateUrl: './edit.html',
})
export class ProfileEdit implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  protected form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(100)],
    ],
    description: ['', [Validators.maxLength(500)]],
    username: [
      '',
      [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    ],
  });

  protected _loading = signal(true);
  protected _submitting = signal(false);
  protected _error = signal<string | null>(null);

  public ngOnInit() {
    this.userService.getMe().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/']);
          return;
        }
        this.form.patchValue({
          name: user.name,
          description: user.description || '',
          username: user.username,
        });
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Не удалось загрузить профиль');
        this._loading.set(false);
      },
    });
  }

  protected onSubmit() {
    if (this.form.invalid) {
      this._error.set('Проверьте правильность заполнения полей');
      return;
    }

    this._submitting.set(true);
    this._error.set(null);

    const { name, description, username } = this.form.value;

    this.userService.updateProfile({ name, description, username }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this._error.set(err.error?.error || 'Ошибка при сохранении');
        this._submitting.set(false);
      },
    });
  }

  protected cancel() {
    this.router.navigate(['/']);
  }
}
