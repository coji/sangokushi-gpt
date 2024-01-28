import DuckDB from 'duckdb'
import { Kysely, sql } from 'kysely'
import { DuckDbDialect } from 'kysely-duckdb'

interface DB {
  user: {
    id: number
    name: string
    email: string
  }
}

export const duckdb = new Kysely<DB>({
  dialect: new DuckDbDialect({
    database: new DuckDB.Database(':memory:'),
    tableMappings: {},
  }),
})

export const test = async () => {
  const res = await sql<number>`SELECT 1`.execute(duckdb)
  return res.rows[0]
}
