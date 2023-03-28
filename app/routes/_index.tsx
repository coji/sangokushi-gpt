import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Input,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { PineconeClient } from '@pinecone-database/pinecone'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import type { V2_MetaFunction } from '@vercel/remix'
import { json, type ActionArgs } from '@vercel/remix'
import invariant from 'tiny-invariant'
import { fetchEmbedding } from '~/services/openai-embedding.server'

export const meta: V2_MetaFunction = () => [
  { property: 'og:title', content: '三国志 GPT' },
  { property: 'og:url', content: 'https://sangokushi-gpt.vercel.app/' },
  { property: 'og:description', content: '三国志の世界をChatGPTで探索。' },
  {
    property: 'og:image',
    content: 'https://sangokushi-gpt.vercel.app/resource/ogp',
  },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:twitter:card', content: 'summary_large_image' },
  { property: 'og:twitter:site', content: '@techtalkjp' },
]

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()

  const input = formData.get('input') as string
  if (input === '') throw new Error('input is empty')

  const { embedding, usage } = await fetchEmbedding(input)

  invariant(process.env.PINECONE_API_KEY, 'PINECONE_API_KEY is required')
  const pinecone = new PineconeClient()
  await pinecone.init({
    environment: 'us-east1-gcp',
    apiKey: process.env.PINECONE_API_KEY,
  })
  const index = pinecone.Index('sangokushi')

  const result = await index.query({
    queryRequest: {
      topK: 5,
      includeMetadata: true,
      vector: embedding,
      namespace: 'vector',
    },
  })
  console.log(result)

  /*
  const qdrant = createQdrant('localhost')
  const { embedding, usage } = await fetchEmbedding(input)
  console.log({ input, usage })
  const { result } = await qdrant.search<Section>({
    collection: 'sangokushi',
    params: {
      limit: 10,
      vector: embedding,
    },
  })
  */

  return json({ result: result.matches, usage, embedding })
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

      <Container py="4" px="2" maxW="container.lg">
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

        <TableContainer overflow="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Score</Th>
                <Th>Section</Th>
                <Th>コンテンツ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {actionData &&
                actionData.result &&
                actionData.result.map((matches) => {
                  return (
                    <Tr key={matches.id}>
                      <Td>{matches.score}</Td>
                      <Td>
                        <Box>
                          {(matches.metadata as Record<string, string>)['file']}
                        </Box>
                        <Box>
                          {
                            (matches.metadata as Record<string, string>)[
                              'chapterTitle'
                            ]
                          }
                        </Box>
                        <Box>
                          {
                            (matches.metadata as Record<string, string>)[
                              'sectionNumber'
                            ]
                          }
                        </Box>
                      </Td>
                      <Td>
                        {
                          (matches.metadata as Record<string, string>)[
                            'content'
                          ]
                        }
                      </Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
        </TableContainer>

        {/* {actionData &&
          actionData.result.map((section) => (
            <HStack key={section.id}>
              <Box>{section.score}</Box>
              <Box>{section.id}</Box>
              <Box>
                {section.payload.chapterTitle} {section.payload.sectionNumber}
              </Box>
            </HStack>
          ))} */}
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
