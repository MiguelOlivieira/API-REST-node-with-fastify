import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { db } from '../database.ts'

// rota para inserção transações

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await db('transactions').select()

    return { transaction } // retornar objeto para futuras adições junto ao transaction
  })

  app.get('/:id', async (request) => {
    const getTransactionByIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionByIdParamsSchema.parse(request.params)

    const transaction = await db('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await db('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (request, reply) => {
    const createTransactionsBodyScrema = z.object({
      // evitar que o body retorne tipos errados
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
