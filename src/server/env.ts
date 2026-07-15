import { Env, isArray, isPort } from 'fenviee';
import { validateString as validateUnitString } from './services/unit-time.service';

export const env = Env.create(process.env)({
  default: {
    PRISMA_CONNECTION_TYPE: 'adapter',
  },
  partial: ['PRISMA_CONNECTION_TYPE'],
  required: [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SESSION_SECRET',
    'HASH_KEY',
    'CALLBACK_URL',
  ],
  unique: {
    PORT: isPort,
    TOKEN_EXPIRATION: validateUnitString,
    ALLOWED_HOSTS: isArray(",")
  },
});
