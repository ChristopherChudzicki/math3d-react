import pg from 'pg-promise'

export const getDb = (options) => pg()({
  connectionString: process.env.DATABASE_URL,
  ...options
})
