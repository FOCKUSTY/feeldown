import type { Post, User } from './prisma.types';

export type ClientPost = Post & {
  user: User;
  isAuthor?: boolean;
};

export type ClientUser = User & {
  posts: Post[];
};
