import { type ActionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'
import { vectorSearch } from '../services/vector-search.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    const formData = await request.formData()
    const input = formData.get('input')?.toString()
    invariant(input, 'Missing input')

    const vectors = await vectorSearch(input)

    const systemPrompt = `あなたは書士です。本の内容に関する質問に答えてください。回答には以下のコンテキストの内容を使って下さい。

コンテキスト:
${vectors.result.map((ret) => `${ret.section.content}`).join('\n')}
`
    console.log(systemPrompt)

    const stream = await OpenAIChatStream(
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
      },
      {
        onComplete: (message) => {
          console.log({ input, message })
        },
      },
    )
    return stream
  } catch (error) {
    console.error('nickname generate action error: ', error)
    return new Response('Something went wrong', { status: 500 })
  }
}