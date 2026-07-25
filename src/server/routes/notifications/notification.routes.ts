import { Router } from 'express';
import { NotificationService } from '../../services/notification.service';
import { ExpressUser } from '../../types';
import { query } from 'express-validator';

export const router: Router = Router();

router.get('/', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const page = parseInt(request.query['page'] as string) || 1;
  const limit = parseInt(request.query['limit'] as string) || 20;
  const result = await NotificationService.getList(user.user.id, {
    page,
    limit,
  });

  response.json({ data: result });
});

router.get('/unread-count', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const count = await NotificationService.getUnreadCount(user.user.id);
  response.json({ data: { count } });
});

router.put('/:id/read', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  await NotificationService.markAsRead(request.params.id, user.user.id);
  response.json({ data: { success: true } });
});

router.put('/read-all', async (request, response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  await NotificationService.markAllAsRead(user.user.id);
  response.json({ data: { success: true } });
});
