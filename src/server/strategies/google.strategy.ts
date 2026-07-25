import passport from 'passport';

import { useStrategy } from './auth.strategy';

const strategy = useStrategy('google', 'passport-google-oauth20', [
  'openid',
  'profile',
  'email',
]);

passport.use(strategy);
