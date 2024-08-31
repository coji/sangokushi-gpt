import { z } from 'zod'

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
})

envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
