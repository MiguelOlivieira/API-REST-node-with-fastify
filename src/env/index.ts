// validacao de dados com zod
import { config } from 'dotenv'
import { z } from 'zod'

// process.env.

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'test') {
  console.log('TESTE')
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE: z.string(),
  USER: z.string(),
  PASSWORD: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env) // passando dados de process.env para o schema

if (_env.success === false) {
  console.error('⚠ Invalid environment variables! ', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
