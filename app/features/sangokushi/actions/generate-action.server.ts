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

    const systemPrompt = `あなたは小説家です。
ユーザからの要望に沿った小説を作ってください。
最初にクライマックスを持ってきて、続きを簡潔にしつつ、続きを読みたくなるような展開にしてください。
500文字以内でお願いします。素材として以下のコンテキストの内容を使って下さい。

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
