import { prisma } from '@/server/prisma';
import { ExpressUser } from '@/server/types';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

export const router = Router();

router.post(
  '/',
  body('content').isString().trim(),
  async (request, response) => {
    const user = request.user as ExpressUser | undefined;
    if (!user) {
      response.sendStatus(HttpStatusCode.Unauthorized);
      return;
    }

    const post = await prisma.post.create({
      data: {
        userId: user.user.id,
        content: request.body.content,
      },
    });

    response.send({ data: post });
  },
);

router.put(
  '/:id',
  param('id').isString().trim().notEmpty(),
  body('content').isString().trim().notEmpty(),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }

    const user = request.user as ExpressUser | undefined;
    if (!user) {
      response.sendStatus(HttpStatusCode.Unauthorized);
      return;
    }

    const id = request.params?.['id'] as string;
    const { content } = request.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingPost) {
      response.status(404).json({ error: 'Пост не найден' });
      return;
    }

    if (existingPost.userId !== user.user.id) {
      response.status(403).json({ error: 'Вы не автор этого поста' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
    });

    response.json({ data: updatedPost });
  },
);

router.get('/:id', async (request, response) => {
  const { id } = request.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!post) {
    response.status(404).json({ error: 'Пост не найден' });
    return;
  }

  const currentUser = (request.user as ExpressUser | undefined)?.user;
  const isAuthor = currentUser ? post.userId === currentUser.id : false;

  response.json({
    data: {
      ...post,
      isAuthor,
    },
  });
});
