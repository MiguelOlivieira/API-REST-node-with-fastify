import { beforeAll, test, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.ts'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // espera o app (aplicação fastify) iniciar antes de testar
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all') // apaga todas as colunas a cada teste
    execSync('npm run knex migrate:latest')
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
  test('o usuario deve conseguir listar todas as suas transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        // server refere-se ao servidor node.js (http.server)
        title: 'New transaction Test22!',
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
        title: 'New transaction Test22!',
        amount: '240.00',
      }),
    ])
  })

  test('o usuario deve conseguir listar uma transação especifica', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction Test!',
        amount: 240,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? [] // pega o cookie do post

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction Test!',
        amount: '240.00',
      }),
    )
  })

  test.only('o usuario deve conseguir ter um sumário de suas transações', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        // server refere-se ao servidor node.js (http.server)
        title: 'Credit transaction Test22!',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? [] // pega o cookie do post

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        // server refere-se ao servidor node.js (http.server)
        title: 'Debit transaction!',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: '3000.00',
    })
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
