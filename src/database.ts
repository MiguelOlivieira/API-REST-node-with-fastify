import { env } from './env/index.ts'
import 'dotenv/config' // variavel de ambiente
import knex from 'knex'
import type { Knex } from 'knex'

export const config: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_URL,

  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)
