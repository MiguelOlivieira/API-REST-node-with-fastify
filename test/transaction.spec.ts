import { beforeAll, test, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.ts'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // espera o app (aplicação fastify) iniciar antes de testar
  })

  afterAll(async () => {
    await app.close()
  })

  test('o usuário consegue criar uma nova transação', async () => {
    // fazer a chamada HTTP p/ criar uma nova transação
    await request(app.server)
      .post('/transactions')
      .send({
        // server refere-se ao servidor node.js (http.server)
        title: 'New transaction Test!',
        amount: 240,
        type: 'credit',
      })
      .expect(201)
  })
  test('o usuario deve conseguir listar as suas transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        // server refere-se ao servidor node.js (http.server)
        title: 'New transaction Test!',
        amount: 240,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? [] // pega o cookie do post

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction Test!',
        amount: '240.00',
      }),
    ])
  })
})

/* test('o usuário consegue criar uma nova transação', async () => {
  // fazer a chamada HTTP p/ criar uma nova transação
  const response = await request(app.server).post('/transactions').send({ // server refere-se ao servidor node.js (http.server)
    title: 'New transaction Test!',
    amount: 240,
    type: 'credit',
  }) 

  expect(response.statusCode).toEqual(201)
})
*/
