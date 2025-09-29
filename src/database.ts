import 'dotenv/config' // variavel de ambiente
import knex from 'knex'
import type { Knex } from 'knex'

if (!process.env.DATABASE! || !process.env.USER || !process.env.PASSWORD) {
  throw new Error(' env NOT FOUND!')
}

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)
