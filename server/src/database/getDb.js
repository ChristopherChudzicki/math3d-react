import pg from 'pg-promise'

export const getDb = () => pg()(process.env.DATABASE_URL)
