import { Router } from 'express';

import { tokenMiddleware } from '../middlewares';

import { router as auth } from './auth';
import { router as users } from './users';
import { router as posts } from './posts';
import { router as notifications } from './notifications';
import { router as friends } from './friends';

export const router: Router = Router();

router.use(tokenMiddleware);

router.use('/auth', auth);
router.use('/users', users);
router.use('/posts', posts);
router.use('/notifications', notifications);
router.use('/friends', friends);
