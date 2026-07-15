import { env } from '@/server/env';
import { ExpressUser } from '@/server/types';
import { Router } from 'express';

import passport from 'passport';

export const router = Router();

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/callback',
  passport.authenticate('google'),
  (request, response) => {
    const user = request.user as ExpressUser | undefined;
    if (!user) {
      response.redirect(env.CALLBACK_URL);
      return;
    }

    response.redirect(`${env.CALLBACK_URL}?token=${user.auth.token}`);
  },
);
