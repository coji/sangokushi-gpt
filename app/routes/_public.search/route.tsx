import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import nl2br from 'react-nl2br'
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { q } = zx.parseQuery(request, { q: z.string().optional() })
  if (!q) {
    return { query: q, result: [] }
  }
  return { query: q, result: [] }
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
              {/* {result?.map((r, i) => (
                <TableRow key={r.document.id}>
                  <TableCell>{Math.round(r.score * 1000) / 10}</TableCell>
                  <TableCell>{r.document.volume_title}</TableCell>
                  <TableCell>{r.document.chapter_title}</TableCell>
                  <TableCell>{nl2br(r.document.content)}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Center>検索ワードを入力してください</Center>
      )}
    </Stack>
  )
}
