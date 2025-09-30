import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions.ts'
import { env } from './env/index.ts'

const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`) // pre handler Global
})

// plugin cookie
app.register(cookie)

// plugin de rota
app.register(transactionsRoutes, {
  prefix: 'transactions', // prefixo para rotas de transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
