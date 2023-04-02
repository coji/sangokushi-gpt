import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { sangokushiSearch } from '~/features/sangokushi/services/sangokushi-search.server'

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const input = url.searchParams.get('input')
  if (!input) {
    return json({
      input: '',
      result: [],
      usage: 0,
    })
  }

  const { result, usage } = await sangokushiSearch(input)
  return json({ input, result, usage })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
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

      <Container py="4" px="2" maxW="container.lg" overflow="auto">
        <Stack>
          <Box as={Form} method="GET">
            <HStack alignItems="end">
              <FormControl>
                <Input
                  bgColor="white"
                  name="input"
                  autoFocus
                  placeholder="劉備と関羽が出会ったシーンは？"
                  defaultValue={loaderData.input}
                />
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

          <Grid gridTemplateColumns="auto auto 1fr" gap="4">
            <Box>Score</Box>
            <Box>文字数</Box>
            <Box>コンテンツ</Box>

            {loaderData &&
              loaderData.result &&
              loaderData.result.map((result) => {
                return (
                  <>
                    <Box>{result.score}</Box>
                    <Box>{result.section.content.length}</Box>
                    <Box>
                      <Text noOfLines={1}>{result.section.content}</Text>
                    </Box>
                  </>
                )
              })}
          </Grid>
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
