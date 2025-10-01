import { env } from './env/index.ts'
import 'dotenv/config' // variavel de ambiente
import knex from 'knex'
import type { Knex } from 'knex'

let connectionConfig: Knex.Config['connection']

if (env.NODE_ENV === 'production') {
  connectionConfig = env.DATABASE_URL
} else {
  connectionConfig = {
    database: env.DATABASE,
    user: env.USER,
    password: env.PASSWORD,
  }
}

export const config: Knex.Config = {
  client: 'pg',
  connection: connectionConfig,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)
