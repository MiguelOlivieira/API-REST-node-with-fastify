import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { db } from '../database.ts'
import { request } from 'http'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.ts'

// rota para inserção transações

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists], // Executa function antes do handler
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await db('transactions')
        .select()
        .where('session_id', sessionId)

      return { transactions } // retornar objeto para futuras adições junto ao transaction
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionByIdParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionByIdParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await db('transactions')
        .where({
          session_id: sessionId,
          id, // nome da chave = nome do valor
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await db('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

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

    let sessionId = request.cookies.sessionId // verifica se ja existe uma sessionId nos cookies

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/', // permite qualquer rota pode acessar o cookie
        maxAge: 60 * 60 * 24 * 7, // 7 days expiration
      })
    }

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1, // caso credito, retorna o amount normal, se debito, retorna negativo.
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
