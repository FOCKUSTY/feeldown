import { prisma } from '@/server/prisma';
import { ExpressUser } from '@/server/types';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';

export const router: Router = Router();

router.post(
  '/',
  body('title').isString().trim().notEmpty(),
  body('postname').optional().isString().trim(),
  body('content').isString().trim().notEmpty(),
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

    let { title, postname, content } = request.body;
    if (!postname) {
      postname =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'post';
      postname = `${postname}-${Date.now().toString(36)}`;
    }

    const existing = await prisma.post.findUnique({
      where: { postname },
    });
    if (existing) {
      response.status(409).json({ error: 'Postname already taken' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        userId: user.user.id,
        title,
        postname,
        content,
      },
    });

    response.send({ data: post });
  },
);

const resolveSlug = (slug: string) => {
  if (slug.startsWith('$')) {
    return {
      postname: slug.slice(1),
      id: undefined,
    };
  }

  return {
    postname: undefined,
    id: slug,
  };
};

router.put(
  '/:slug',
  param('slug').isString().trim().notEmpty(),
  body('title').optional().isString().trim().notEmpty(),
  body('postname').optional().isString().trim().notEmpty(),
  body('content').optional().isString().trim().notEmpty(),
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

    const slug = request.params?.['slug'] as string;
    const where = resolveSlug(slug);

    const existingPost = await prisma.post.findUnique({
      where,
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

    const { title, postname, content } = request.body;

    if (postname && postname !== existingPost.postname) {
      const existing = await prisma.post.findUnique({
        where: { postname },
      });

      if (existing) {
        response
          .status(409)
          .json({ error: 'Пост с таким именем уже существует' });
        return;
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (postname !== undefined) updateData.postname = postname;
    if (content !== undefined) updateData.content = content;

    const updatedPost = await prisma.post.update({
      where,
      data: updateData,
    });

    response.json({
      data: updatedPost,
    });
  },
);

router.get('/:slug', async (request, response) => {
  const { slug } = request.params;
  const where = resolveSlug(slug);

  const post = await prisma.post.findUnique({
    where,
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
