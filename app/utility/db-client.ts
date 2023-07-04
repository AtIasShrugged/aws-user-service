import { Client } from 'pg'

export const DbClient = () => {
  return new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    user: process.env.DATABASE_USER || 'root',
    database: process.env.DATABASE_NAME || 'aws_user_service',
    password: process.env.DATABASE_PASS || 'root',
    port: +process.env.DATABASE_PORT || 5432,
  })
}
