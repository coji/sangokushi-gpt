import type { LoaderFunctionArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import ReactMarkdown from 'react-markdown'
import { z } from 'zod'
import { zx } from 'zodix'
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
import { searchSections } from './queries.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { q } = zx.parseQuery(request, { q: z.string().optional() })
  if (!q) {
    return { query: q, result: [] }
  }

  const result = await searchSections(q)
  return { query: q, result }
}

export default function SearchPage() {
  const { query, result } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <Stack className="h-full">
      <Form>
        <HStack>
          <Input
            autoFocus
            name="q"
            placeholder="酒を飲む張飛"
            defaultValue={query}
          />
          <Button
            isLoading={navigation.state !== 'idle'}
            disabled={navigation.state !== 'idle'}
          >
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
              {result.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{Math.round(r.score * 1000) / 10}</TableCell>
                  <TableCell>{r.volumeTitle}</TableCell>
                  <TableCell>{r.chapterTitle}</TableCell>
                  <TableCell>
                    <ReactMarkdown>{r.content}</ReactMarkdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Center>検索ワードを入力してください</Center>
      )}
    </Stack>
  )
}
