import type { FriendshipStatus } from '@/app/services';
import type { User, Post } from '@/server/types';

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FdButton } from '@/app/components';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'base-user',
  standalone: true,
  imports: [CommonModule, RouterLink, FdButton, MarkdownComponent],
  templateUrl: './base-user.html',
})
export class BaseUserComponent {
  @Input()
  public user: User | null = null;
  @Input()
  public posts: Post[] = [];
  @Input()
  public isMe = false;
  @Input()
  public loading = false;
  @Input()
  public error: string | null = null;

  @Input()
  public friendshipStatus: FriendshipStatus = 'none';
  @Input()
  public friendshipId: string | null = null;
  @Input()
  public currentUserId: string | null = null;

  @Output()
  public goBack = new EventEmitter<void>();

  @Output()
  public editProfile = new EventEmitter<void>();

  @Output()
  public sendFriendRequest = new EventEmitter<void>();

  @Output()
  public acceptFriendRequest = new EventEmitter<void>();

  @Output()
  public rejectFriendRequest = new EventEmitter<void>();

  @Output()
  public removeFriend = new EventEmitter<void>();

  protected cleanMarkdown(
    content: string | null | undefined,
    maxLength?: number,
  ): string {
    if (!content) return '';

    let plain = content;
    plain = plain.replace(/```[\s\S]*?```/g, '');
    plain = plain.replace(/`([^`]+)`/g, '$1');
    plain = plain.replace(/^#{1,6}\s+/gm, '');
    plain = plain.replace(/^[\s]*[-*+]\s+/gm, '');
    plain = plain.replace(/^[\s]*\d+\.\s+/gm, '');
    plain = plain.replace(/\*\*([^*]+)\*\*/g, '$1');
    plain = plain.replace(/\*([^*]+)\*/g, '$1');
    plain = plain.replace(/__([^_]+)__/g, '$1');
    plain = plain.replace(/_([^_]+)_/g, '$1');
    plain = plain.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    plain = plain.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
    plain = plain.replace(/^>\s+/gm, '');
    plain = plain.replace(/^[\s]*[-*_]{3,}\s*$/gm, '');
    plain = plain.replace(/<[^>]+>/g, '');
    plain = plain.replace(/\n{3,}/g, '\n\n');
    plain = plain.trim();

    if (maxLength && plain.length > maxLength) {
      plain = plain.slice(0, maxLength) + '…';
    }

    return plain;
  }

  protected get isFriend(): boolean {
    return this.friendshipStatus === 'friends';
  }

  protected get isPendingSent(): boolean {
    return this.friendshipStatus === 'pending_sent';
  }

  protected get isPendingReceived(): boolean {
    return this.friendshipStatus === 'pending_received';
  }

  protected get canSendRequest(): boolean {
    return (
      this.friendshipStatus === 'none' &&
      !this.isMe &&
      this.currentUserId !== this.user?.id
    );
  }
}
