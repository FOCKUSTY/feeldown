import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/server/prisma/schema.prisma',
  migrations: {
    path: 'src/server/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
