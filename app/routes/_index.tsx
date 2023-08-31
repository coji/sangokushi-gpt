import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppLayout } from '~/components/AppLayout'
import { Button, HStack, Input, Stack } from '~/components/ui'
import { SectionReference } from '~/features/sangokushi/components/SectionReference'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { fetchMostSimilarDoc, search } from '~/services/api.server'

export const loader = async ({ request }: LoaderArgs) => {
  const { input } = zx.parseQuery(request, { input: z.string().optional() })
  if (!input) {
    return json<{
      input: string
      result: Awaited<ReturnType<typeof search>>
      doc: Awaited<ReturnType<typeof fetchMostSimilarDoc>> | null
    }>({
      input: '',
      result: [],
      doc: null,
    })
  }

  const [result, doc] = await Promise.all([search(input), fetchMostSimilarDoc(input)])

  return json({ input, result, doc })
}

export default function Index() {
  const { result, input, doc } = useLoaderData<typeof loader>()
  const generator = useGenerator()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const { input } = await zx.parseForm(formData, { input: z.string().optional() })
    if (input) {
      void generator.generate(input) // ストリーミングで生成
    }
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
            <Button variant="default" type="submit" isLoading={generator.isLoading} disabled={generator.isLoading}>
              Query
            </Button>
          </HStack>
        </Form>

        <div className="flex justify-end">
          <HStack>
            {doc &&
              result.slice(0, 1).map((ret) => {
                return (
                  <SectionReference key={doc.id} section={doc}>
                    <div className="text-xs font-bold">
                      {Math.round(ret.score * 1000) / 10}
                      <small>%</small> Match
                    </div>
                  </SectionReference>
                )
              })}
          </HStack>
        </div>

        <div className="leading-8">
          {generator.error ? <div className="text-destructive">{generator.error}</div> : nl2br(generator.data)}
        </div>
      </Stack>
    </AppLayout>
  )
}
