import { prisma } from '@/server/prisma';
import { ExpressUser } from '@/server/types';
import { HttpStatusCode } from '@angular/common/http';
import { response, Router } from 'express';
import { body, validationResult } from 'express-validator';

export const router: Router = Router();

router.get('/@me', (request, response) => {
  const user = request.user as ExpressUser | undefined;
  response.json({ data: user?.user || null });
});

const resolveSlug = (slug: string) => {
  if (slug.startsWith('@')) {
    return {
      username: slug.slice(1),
      id: undefined,
    };
  }

  return {
    username: undefined,
    id: slug,
  };
};

const getUser = async <T extends Record<string, boolean>>(
  slug: string,
  include?: T,
) => {
  const data = resolveSlug(slug);
  const user = await prisma.user.findFirst({ where: data, include });
  return user;
};

router.get('/:slug', async (request, response) => {
  const { slug } = request.params;

  if (slug === '@me') {
    const user = request.user as ExpressUser | undefined;
    response.json({ data: user?.user || null });
    return;
  }

  const user = await getUser(slug);
  response.json({ data: user || null });
});

router.get('/:slug/posts', async (request, response) => {
  const { slug } = request.params;
  const where = (() => {
    if (slug !== '@me') {
      return resolveSlug(slug);
    }

    const user = request.user as ExpressUser | undefined;
    if (!user) {
      response.sendStatus(500);
      return false;
    }

    return { id: user.user.id };
  })();

  if (!where) {
    return;
  }

  const user = await prisma.user.findFirst({ where, include: { posts: true } });
  if (!user) {
    response.sendStatus(HttpStatusCode.BadRequest);
    return;
  }

  response.json({ data: user.posts });
});

router.put(
  '/@me',
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isString().trim().isLength({ max: 4096 }),
  body('username')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/),
  async (request, response) => {
    const user = request.user as ExpressUser | undefined;
    if (!user) {
      response.sendStatus(HttpStatusCode.Unauthorized);
      return;
    }

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, description, username } = request.body;
    if (username) {
      const existing = await prisma.user.findUnique({
        where: { username },
      });

      if (existing && existing.id !== user.user.id) {
        response.status(409).json({ error: 'Username already taken' });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(username !== undefined && { username }),
      },
    });

    response.json({ data: updatedUser });
  },
);
