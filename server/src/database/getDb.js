import pg from 'pg-promise'

/**
 * This doesn't seem great.
 */
const DEFAULT_OPTIONS = { ssl: { sslmode: 'require', rejectUnauthorized: false  } };

export const getDb = (options) => pg()({
  connectionString: process.env.DATABASE_URL,
  ...DEFAULT_OPTIONS,
  ...options
});
