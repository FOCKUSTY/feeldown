import { Router } from 'express';

import { tokenMiddleware } from '../middlewares';

import { router as auth } from './auth';
import { router as users } from './users';
import { router as posts } from './posts';

export const router = Router();

router.use(tokenMiddleware);

router.use('/auth', auth);
router.use('/users', users);
router.use('/posts', posts);
