import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { json, type ActionArgs } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { sangokushiSearch } from '~/features/sangokushi/services/sangokushi-search.server'

// export const meta: V2_MetaFunction = () => [
// { property: 'og:title', content: '三国志 GPT' },
// { property: 'og:url', content: 'https://sangokushi-gpt.vercel.app/' },
// { property: 'og:description', content: '三国志の世界をChatGPTで探索。' },
// {
//   property: 'og:image',
//   content: 'https://sangokushi-gpt.vercel.app/resource/ogp',
// },
// { property: 'og:image:width', content: '1200' },
// { property: 'og:image:height', content: '630' },
// { property: 'og:twitter:card', content: 'summary_large_image' },
// { property: 'og:twitter:site', content: '@techtalkjp' },
// ]

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()

  const input = formData.get('input') as string
  if (input === '') throw new Error('input is empty')

  const { result, usage } = await sangokushiSearch(input)
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

      <Container py="4" px="2" maxW="container.lg">
        <Stack>
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

          <TableContainer>
            <Table maxW="full">
              <Thead>
                <Tr>
                  <Th>Score</Th>
                  <Td>文字数</Td>
                  <Th>コンテンツ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {actionData &&
                  actionData.result &&
                  actionData.result.map((result) => {
                    return (
                      <Tr key={result.id}>
                        <Td>{result.score}</Td>
                        <Td>{result.section.content.length}</Td>
                        <Td>{result.section.content}</Td>
                      </Tr>
                    )
                  })}
              </Tbody>
            </Table>
          </TableContainer>
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
