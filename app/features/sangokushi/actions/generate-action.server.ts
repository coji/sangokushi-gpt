import { type ActionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { fetchMostSimilarDoc } from '~/services/api.server'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    const formData = await request.formData()
    const input = formData.get('input')?.toString()
    invariant(input, 'Missing input')

    const doc = await fetchMostSimilarDoc(input)

    const systemPrompt = `
You are a professional novelist.
Create a short story that meets the user's request.


# Plot
 - Start with a climax.
 - Keep the continuation brief.
 - End with a cliffhanger that makes the reader want to read the next story.

# Rules
 - Keep it under 600 characters.
 - Use simple words.
 - Leave a blank line between paragraphs for readability.
 - Use the format "Character Name: 「[Dialogue]」" for the character's speech.
 - Use the following context as much as possible:

Context:
${doc.content}

- All output must be in Japanese.

`
    //    console.log({ systemPrompt, input })

    const stream = await OpenAIChatStream(
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
        max_tokens: 1500,
        frequency_penalty: 1,
      },
      {
        onComplete: (message) => {
          //          console.log({ input, message })
        },
      },
    )
    return stream
  } catch (error) {
    console.error('generate action error: ', error)
    return new Response('Something went wrong', { status: 500 })
  }
}
