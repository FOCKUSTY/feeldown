import { ExpressUser } from '@/server/types';
import { Router } from 'express';

export const router = Router();

router.get('/', (request, response) => {
  const user = request.user as ExpressUser | undefined;
  response.json({ data: user?.user || null });
});
