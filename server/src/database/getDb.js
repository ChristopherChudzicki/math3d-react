import pg from 'pg-promise'

export const getDb = () => pg()(process.env.DB_URI)
