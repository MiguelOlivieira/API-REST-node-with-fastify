import 'dotenv/config' // variavel de ambiente
import knex from 'knex'
import type { Knex } from 'knex'
import { env } from './env/index.ts'

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    database: env.DATABASE,
    user: env.USER,
    password: env.PASSWORD,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)
