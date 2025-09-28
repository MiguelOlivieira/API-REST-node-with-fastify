import fastify from 'fastify'
import { db } from './database.js'

const app = fastify()

app.get('/hello', () => {
  const test = db('userteste').select('*')

  return test
})
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
