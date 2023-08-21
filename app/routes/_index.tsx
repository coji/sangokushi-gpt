import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { AppLayout } from '~/components/AppLayout'
import { Button, HStack, Input, Stack } from '~/components/ui'
import { SectionReference } from '~/features/sangokushi/components/SectionReference'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { vectorSearchQdrant } from '~/features/sangokushi/services/vector-search.server'

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const input = url.searchParams.get('input')
  if (!input) {
    return json<{ input: string; vectorResult: Awaited<ReturnType<typeof vectorSearchQdrant>>[number][] }>({
      input: '',
      vectorResult: [],
    })
  }

  console.time('vector search')
  const vectorResult = await vectorSearchQdrant(input, 1)
  console.timeEnd('vector search')
  return json({ input, vectorResult })
}

export default function Index() {
  const { vectorResult, input } = useLoaderData<typeof loader>()
  const generator = useGenerator()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault() // submit も実際にすることで、URL にクエリパラメータを追加する
    const formData = new FormData(e.currentTarget)
    const input = String(formData.get('input'))
    void generator.generate(input) // ストリーミングで生成
  }

  return (
    <AppLayout>
      <Stack>
        <Form onSubmit={(e) => handleFormSubmit(e)} autoComplete="off">
          <HStack>
            <Input
              className="w-full flex-1"
              name="input"
              autoFocus
              placeholder="劉備と関羽が出会ったシーンは？"
              defaultValue={input}
            />
            <Button variant="default" type="submit" disabled={generator.isLoading}>
              Query
            </Button>
          </HStack>
        </Form>

        <div className="flex justify-end">
          <HStack>
            {vectorResult.slice(0, 1).map((result) => {
              return (
                <SectionReference key={result.id} section={result.section}>
                  <div className="text-xs font-bold">
                    {Math.round(result.score * 1000) / 10}
                    <small>%</small> Match
                  </div>
                </SectionReference>
              )
            })}
          </HStack>
        </div>

        <div className="grid grid-cols-[auto_auto_1fr] gap-4">{nl2br(generator.data)}</div>
      </Stack>
    </AppLayout>
  )
}
