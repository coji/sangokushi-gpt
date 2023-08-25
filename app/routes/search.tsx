import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
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
import { search } from '~/services/api.server'

export const loader = async ({ request }: LoaderArgs) => {
  const { q } = zx.parseQuery(request, { q: z.string().optional() })
  if (!q) {
    return json<{ query: string; result: Awaited<ReturnType<typeof search>> }>({
      query: '',
      result: [],
    })
  }

  const result = await search(q)
  console.log(result.length)
  return json({ query: q, result })
}

export default function SearchPage() {
  const { query, result } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <AppLayout>
      <Stack className="h-full">
        <Form>
          <HStack>
            <Input autoFocus name="q" defaultValue={query} />
            <Button isLoading={navigation.state !== 'idle'} disabled={navigation.state !== 'idle'}>
              Search
            </Button>
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
                  <TableRow key={r.document.id}>
                    <TableCell>
                      {r.document.id} {Math.round(r.score * 1000) / 10}
                    </TableCell>
                    <TableCell>{r.document.volumeTitle}</TableCell>
                    <TableCell>{r.document.chapterTitle}</TableCell>
                    <TableCell className="max-w-sm truncate">{nl2br(r.document.content)}</TableCell>
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
