import { experimental_useObject as useObject } from '@ai-sdk/react'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import ReactMarkdown from 'react-markdown'
import { z } from 'zod'
import { zx } from 'zodix'
import { Button, HStack, Input, Stack } from '~/components/ui'
import { schema } from '~/routes/resources.generate/route'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { input } = zx.parseQuery(request, { input: z.string().optional() })

  return { input: '', result: [] }
}

export default function Index() {
  const { result, input } = useLoaderData<typeof loader>()
  const { submit, stop, error, isLoading, object } = useObject({
    api: '/resources/generate',
    schema,
  })

  return (
    <Stack>
      <Form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const input = formData.get('input')?.toString()
          if (!input) {
            alert('Input is required')
            return
          }
          submit({ input })
        }}
      >
        <HStack>
          <Input
            className="w-full flex-1"
            name="input"
            autoFocus
            placeholder="劉備と関羽が出会ったシーンは？"
            defaultValue={input}
          />
          <Button variant="default" type="submit">
            Query
          </Button>
        </HStack>
      </Form>

      {object && <ReactMarkdown>{object.story}</ReactMarkdown>}
    </Stack>
  )
}
