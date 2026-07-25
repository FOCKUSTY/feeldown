import passport from 'passport';

import { useStrategy } from './auth.strategy';

const strategy = useStrategy('google', [
  'openid',
  'profile',
  'email',
]);

passport.use(strategy);
