import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
} from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { similarSections } from '~/models/section.server'
import { fetchEmbedding } from '~/services/openai-embedding.server'

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const input = url.searchParams.get('input')
  if (!input) {
    return json({ input: null, sections: [] })
  }

  const { embedding } = await fetchEmbedding(input)
  const sections = await similarSections(embedding, 10)

  return json({ input, sections })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <Box
      bgColor="gray.100"
      minH="100dvh"
      display="grid"
      gridTemplateRows="auto 1fr auto"
    >
      <Box textAlign="center" bgColor="white" px="2" py="4">
        <Heading>test</Heading>
      </Box>

      <Container py="4" px="2" maxW="container.lg" position="relative">
        <Stack>
          <Form autoComplete="off">
            <HStack align="end">
              <FormControl>
                <Input
                  bgColor="white"
                  name="input"
                  autoFocus
                  placeholder="劉備と関羽が出会ったシーンは？"
                  defaultValue={loaderData.input ?? undefined}
                />
              </FormControl>
              <Button colorScheme="blue" type="submit">
                Query
              </Button>
            </HStack>
          </Form>

          <Flex justify="end">
            <Box maxW="full" overflow="auto">
              <pre>{JSON.stringify(loaderData.sections, null, 2)}</pre>
            </Box>
          </Flex>
        </Stack>
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
