import { Router } from 'express';

import { tokenMiddleware } from '../middlewares';

import { router as auth } from './auth';
import { router as user } from './user';

export const router = Router();

router.use(tokenMiddleware);

router.use('/auth', auth);
router.use('/user', user);
