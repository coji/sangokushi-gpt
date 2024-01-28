import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { test } from '~/services/.server/duckdb.server'

export const loader = async () => {
  const result = await test()
  return json({ result })
}

export default function TestPage() {
  const { result } = useLoaderData<typeof loader>()

  return <div>hoge {JSON.stringify(result)}</div>
}
