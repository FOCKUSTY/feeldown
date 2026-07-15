import { prisma } from '@/server/prisma';
import { ExpressUser } from '@/server/types';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from 'express';
import { body } from 'express-validator';

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

router.get('/:id', async (request, response) => {
  const { id } = request.params;

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  response.send({ data: post });
});
