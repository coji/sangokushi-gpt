import { google } from '@ai-sdk/google'
import type { ActionFunctionArgs } from '@remix-run/node'
import { streamObject } from 'ai'
import { z } from 'zod'

export const schema = z.object({
  story: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const json = await request.json()
  const input = json.input
  if (!input) {
    throw new Error('Input is required')
  }

  const system = `
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

- All output must be in Japanese.`

  const result = await streamObject({
    model: google('gemini-1.5-flash-latest'),
    schema,
    system,
    prompt: input,
    onFinish: (event) => console.log({ input, event: event }),
  })

  return result.toTextStreamResponse()
}
