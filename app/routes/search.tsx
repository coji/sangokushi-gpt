import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import nl2br from 'react-nl2br'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppLayout } from '~/components/AppLayout'
import {
  Button,
  Center,
  HStack,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { vectorSearchQdrant } from '~/features/sangokushi/services/vector-search.server'

export const loader = async ({ request }: LoaderArgs) => {
  const { q: query } = zx.parseQuery(request, { q: z.string().optional() })
  if (!query) {
    return json<{ query: string; result: Awaited<ReturnType<typeof vectorSearchQdrant>>[number][] }>({
      query: '',
      result: [],
    })
  }

  const result = await vectorSearchQdrant(query, 10)
  return json({ query, result })
}

export default function SearchPage() {
  const { query, result } = useLoaderData<typeof loader>()

  return (
    <AppLayout>
      <Stack className="h-full">
        <Form>
          <HStack>
            <Input autoFocus name="q" defaultValue={query} />
            <Button>Search</Button>
          </HStack>
        </Form>

        {result.length > 0 ? (
          <div className="flex-1 rounded bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Score</TableHead>
                  <TableHead>巻</TableHead>
                  <TableHead>章</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{Math.round(r.score * 1000) / 10}</TableCell>
                    <TableCell>{r.section.volumeTitle}</TableCell>
                    <TableCell>{r.section.chapterTitle}</TableCell>
                    <TableCell className="max-w-sm truncate">{nl2br(r.section.content)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Center>検索ワードを入力してください</Center>
        )}
      </Stack>
    </AppLayout>
  )
}
