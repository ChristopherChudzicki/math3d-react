import pg from 'pg-promise';

const dbConfig = {
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "database": process.env.DB_NAME,
  "user": process.env.DB_USER,
};

export const getDb = () => pg()(dbConfig);