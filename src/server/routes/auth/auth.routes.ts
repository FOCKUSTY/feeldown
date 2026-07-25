import type { ExpressUser, Provider } from '@/server/types';
import type { Request, Response } from 'express';
import { Router } from 'express';
import { PROVIDERS } from '@/server/constants';
import { env } from '@/server/env';

import passport from 'passport';

export const router: Router = Router();

const handle = (request: Request, response: Response) => {
  const user = request.user as ExpressUser | undefined;
  if (!user) {
    response.redirect(env.CALLBACK_URL);
    return;
  }

  response.redirect(`${env.CALLBACK_URL}?token=${user.auth.token}`);
};

const register = (provider: Provider) => {
  router.get(`/${provider}`, passport.authenticate(`${provider}`));

  router.get(
    `/${provider}/callback`,
    passport.authenticate(`${provider}`),
    handle,
  );
};

PROVIDERS.forEach(register);
