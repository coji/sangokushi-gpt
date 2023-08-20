import { defer, type LoaderArgs } from '@remix-run/node'
import { Await, Form, Link, useLoaderData } from '@remix-run/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { Button, Heading, HStack, Input, Stack } from '~/components/ui'
import { SectionReference } from '~/features/sangokushi/components/SectionReference'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { vectorSearchQdrant } from '~/features/sangokushi/services/vector-search.server'

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const input = url.searchParams.get('input')
  if (!input) {
    return defer({
      input: '',
      vectorResult: {
        result: [],
        usage: 0,
      } as {
        result: Awaited<ReturnType<typeof vectorSearchQdrant>>['result']['0'][]
        usage: number
      },
    })
  }

  const vectorResult = vectorSearchQdrant(input, 10)
  return defer({ input, vectorResult })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const generator = useGenerator()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault() // submit も実際にすることで、URL にクエリパラメータを追加する
    const formData = new FormData(e.currentTarget)
    const input = String(formData.get('input'))
    void generator.generate(input) // ストリーミングで生成
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200">
      <header className="container bg-background py-2">
        <Heading>三国志 GPT</Heading>
      </header>

      <main className="container relative py-4">
        <Stack>
          <Form onSubmit={(e) => handleFormSubmit(e)} autoComplete="off">
            <HStack>
              <Input
                className="w-full flex-1"
                name="input"
                autoFocus
                placeholder="劉備と関羽が出会ったシーンは？"
                defaultValue={loaderData.input}
              />
              <Button variant="default" type="submit" disabled={generator.isLoading}>
                Query
              </Button>
            </HStack>
          </Form>

          <div className="flex justify-end">
            <React.Suspense fallback={<p>Loading..</p>}>
              <Await resolve={loaderData.vectorResult} errorElement={<div>Error</div>}>
                {(vectorResult) => (
                  <HStack>
                    {vectorResult.result.slice(0, 1).map((result) => {
                      return (
                        <SectionReference key={result.id} section={result.section}>
                          <div className="text-xs font-extrabold text-green-500">
                            {Math.round(result.score * 1000) / 10}
                            <small>%</small> Match
                          </div>
                        </SectionReference>
                      )
                    })}
                  </HStack>
                )}
              </Await>
            </React.Suspense>
          </div>

          <div className="grid grid-cols-[auto_auto_1fr] gap-4">{nl2br(generator.data)}</div>
        </Stack>
      </main>

      <footer className="container bg-background py-2 text-center">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <Link to="https://twitter.com/techtalkjp/" target="_blank" color="blue.500">
          coji
        </Link>
        <div>
          <Link to="https://github.com/coji/sangokushi-gpt" target="_blank" color="blue.500">
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  )
}
