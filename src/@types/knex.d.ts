// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  // definição de tipos, pra facilitar o preenchimento das colunas da tabelas
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
