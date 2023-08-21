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
import { vectorSearchQdrant } from '~/features/sangokushi/services/vector-search.server'

export const loader = async ({ request }: LoaderArgs) => {
  const { input } = zx.parseQuery(request, { input: z.string().optional() })
  if (!input) {
    return json<{ input: string; vectorResult: Awaited<ReturnType<typeof vectorSearchQdrant>>[number][] }>({
      input: '',
      vectorResult: [],
    })
  }

  const vectorResult = await vectorSearchQdrant(input, 1)
  return json({ input, vectorResult })
}

export default function Index() {
  const { vectorResult, input } = useLoaderData<typeof loader>()
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

        <>{generator.isError ? <div className="text-destructive">{generator.error}</div> : nl2br(generator.data)}</>
      </Stack>
    </AppLayout>
  )
}
