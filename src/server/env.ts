import { Env, isArray, isPort } from 'fenviee';
import { validateString as validateUnitString } from './services/unit-time.service';
import { AUTH_PARAMETERS } from './constants';

export const env = Env.create(process.env)({
  default: {
    PRISMA_CONNECTION_TYPE: 'adapter',
  },
  partial: ['PRISMA_CONNECTION_TYPE'],
  required: [
    ...AUTH_PARAMETERS,
    'DATABASE_URL',
    'SESSION_SECRET',
    'HASH_KEY',
    'CALLBACK_URL',
  ],
  unique: {
    PORT: isPort,
    TOKEN_EXPIRATION: validateUnitString,
    ALLOWED_HOSTS: isArray(','),
  },
});
