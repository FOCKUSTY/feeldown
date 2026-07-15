import { env } from '../env';
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const ADAPTER =
  env.NODE_ENV === 'development'
    ? new PrismaPg({ connectionString: env.DATABASE_URL })
    : undefined;

const ACCELERATE_URL =
  env.NODE_ENV === 'development' ? undefined : env.DATABASE_URL;

const OPTIONS = {
  adapter: ADAPTER,
  accelerateUrl: ACCELERATE_URL,
} as ConstructorParameters<typeof PrismaClient>[0];

export const prisma = new PrismaClient(OPTIONS);
