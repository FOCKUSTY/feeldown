import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User, Post } from '@/server/types';
import { FdButton } from '@/app/components';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'base-user',
  standalone: true,
  imports: [CommonModule, RouterLink, FdButton, MarkdownComponent],
  templateUrl: './base-user.html',
})
export class BaseUserComponent {
  @Input() user: User | null = null;
  @Input() posts: Post[] = [];
  @Input() isMe = false;
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() goBack = new EventEmitter<void>();
  @Output() editProfile = new EventEmitter<void>();
}
