import passport from 'passport';

import { useStrategy } from './auth.strategy';

const strategy = useStrategy('github', []);

passport.use(strategy);
