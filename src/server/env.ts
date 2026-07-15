import { Env, isPort } from 'fenviee';
import { validateString as validateUnitString } from './services/unit-time.service';

export const env = Env.create(process.env)({
  default: {
    NODE_ENV: 'development',
  },
  partial: ['NODE_ENV'],
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
  },
});
