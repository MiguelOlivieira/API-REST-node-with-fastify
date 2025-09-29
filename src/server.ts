import fastify from 'fastify'
import { db } from './database.js'
import crypto from 'node:crypto'

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
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
