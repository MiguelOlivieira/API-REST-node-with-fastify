import fastify from 'fastify'
import { db } from './database.js'
import crypto from 'node:crypto'
import { env } from '../env/index.ts'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await db('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    })
    .returning('*')

  return transaction
})
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
