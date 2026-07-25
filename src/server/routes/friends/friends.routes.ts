import type { ExpressUser } from '@/server/types';

import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { HttpStatusCode } from '@angular/common/http';

import { FriendshipService } from '@/server/services/friendship.service';
import { prisma } from '@/server/prisma';

export const router: Router = Router();

router.get(
  '/friendship-id/:userId',
  param('userId').isUUID(),
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

    const otherUserId = request.params?.['userId'];
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: user.user.id, receiverId: otherUserId },
          { initiatorId: otherUserId, receiverId: user.user.id },
        ],
        status: 'ACCEPTED',
      },
      select: { id: true },
    });

    response.json({ data: { friendshipId: friendship?.id || null } });
  },
);

router.post(
  '/request/:userId',
  param('userId').isUUID(),
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

    const receiverId = request.params?.['userId'];
    try {
      const friendship = await FriendshipService.sendRequest(
        user.user.id,
        receiverId,
      );
      response.json({ data: friendship });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка при отправке запроса';
      response.status(400).json({ error: message });
    }
  },
);

router.post(
  '/accept/:friendshipId',
  param('friendshipId').isUUID(),
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

    const friendshipId = request.params?.['friendshipId'];
    try {
      const friendship = await FriendshipService.acceptRequest(
        friendshipId,
        user.user.id,
      );
      response.json({ data: friendship });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка при принятии запроса';
      response.status(400).json({ error: message });
    }
  },
);

router.post(
  '/reject/:friendshipId',
  param('friendshipId').isUUID(),
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

    const friendshipId = request.params?.['friendshipId'];
    try {
      await FriendshipService.rejectRequest(friendshipId, user.user.id);
      response.json({ data: { success: true } });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка при отклонении запроса';
      response.status(400).json({ error: message });
    }
  },
);

router.delete(
  '/:friendshipId',
  param('friendshipId').isUUID(),
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

    const friendshipId = request.params?.['friendshipId'] as string;
    try {
      await FriendshipService.removeFriend(friendshipId, user.user.id);
      response.json({ data: { success: true } });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка при удалении из друзей';
      response.status(400).json({ error: message });
    }
  },
);

router.get('/', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.sendStatus(HttpStatusCode.Unauthorized);
    return;
  }

  const friends = await FriendshipService.getFriends(user.user.id);
  response.json({ data: friends });
});

router.get(
  '/status/:userId',
  param('userId').isUUID(),
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

    const otherUserId = request.params?.['userId'] as string;
    const status = await FriendshipService.getStatus(user.user.id, otherUserId);
    response.json({ data: { status } });
  },
);

router.get('/incoming', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.sendStatus(HttpStatusCode.Unauthorized);
    return;
  }

  const requests = await FriendshipService.getIncomingRequests(user.user.id);
  response.json({ data: requests });
});

router.get('/outgoing', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.sendStatus(HttpStatusCode.Unauthorized);
    return;
  }

  const requests = await FriendshipService.getOutgoingRequests(user.user.id);
  response.json({ data: requests });
});
