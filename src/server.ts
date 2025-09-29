import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions.ts'
import { env } from './env/index.ts'

const app = fastify()

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
