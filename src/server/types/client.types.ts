import type { Post, User } from './prisma.types';

export type ClientPost = Post & {
  user: User;
};

export type ClientUser = User & {
  posts: Post[];
};
