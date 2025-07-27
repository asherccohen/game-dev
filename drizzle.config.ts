import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    // connectionString: process.env.DB_FILE_NAME!,S
    url: process.env.DB_FILE_NAME!,
  },
});
