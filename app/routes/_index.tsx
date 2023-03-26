import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Input,
  Link,
} from '@chakra-ui/react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { json, type ActionArgs } from '@vercel/remix'
import { createQdrant } from 'scripts/services/qdrant'
import type { Section } from 'types/model'
import { fetchEmbedding } from '~/services/openai-embedding.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()

  const qdrant = createQdrant('localhost')

  const input = formData.get('input') as string
  if (input === '') throw new Error('input is empty')

  const { embedding, usage } = await fetchEmbedding(input)
  console.log({ input, usage })
  const { result } = await qdrant.search<Section>({
    collection: 'sangokushi',
    params: {
      limit: 10,
      vector: embedding,
    },
  })

  return json({ result, usage })
}

export default function Index() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <Box
      bgColor="gray.100"
      h="100dvh"
      display="grid"
      gridTemplateRows="auto 1fr auto"
    >
      <Box textAlign="center" bgColor="white" px="2" py="4">
        <Heading>三国志 GPT</Heading>
      </Box>

      <Container py="4" px="2">
        <Box as={Form} method="post">
          <HStack alignItems="end">
            <FormControl>
              <Input
                bgColor="white"
                name="input"
                autoFocus
                placeholder="劉備と関羽が出会ったシーンは？"
              ></Input>
            </FormControl>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={navigation.state !== 'idle'}
            >
              Query
            </Button>
          </HStack>
        </Box>

        {actionData &&
          actionData.result.map((section) => (
            <HStack key={section.id}>
              <Box>{section.score}</Box>
              <Box>{section.id}</Box>
              <Box>
                {section.payload.chapterTitle} {section.payload.sectionNumber}
              </Box>
            </HStack>
          ))}
      </Container>

      <Box textAlign="center" px="2" py="4" bgColor="white">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <Link
          href="https://twitter.com/techtalkjp/"
          target="_blank"
          color="blue.500"
        >
          coji
        </Link>
        <Box>
          <Link
            href="https://github.com/coji/sangokushi-gpt"
            target="_blank"
            color="blue.500"
          >
            GitHub
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
