import passport from 'passport';

import { useStrategy } from './auth.strategy';

const strategy = useStrategy('github', 'passport-github', []);

passport.use(strategy);
