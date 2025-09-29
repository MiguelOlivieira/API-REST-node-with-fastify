import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { db } from '../src/database.ts'

// rota para inserção transações

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await db('transactions').select()

    return transaction
  })

  app.post('/', async (request, reply) => {
    const createTransactionsBodyScrema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionsBodyScrema.parse(
      request.body,
    )

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1, // caso credito, retorna o amount normal, se debito, retorna negativo.
    })

    return reply.status(201).send()
  })
}
