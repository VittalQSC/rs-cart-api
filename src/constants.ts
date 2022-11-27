export const JWT_CONFIG = {
  secret: 'secret',
  expiresIn: '12h'
}

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

export const DB_OPTIONS = {
  host: DB_HOST,
  port: +DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
}