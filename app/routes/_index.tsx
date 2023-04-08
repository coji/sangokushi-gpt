import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Grid,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { defer, type LoaderArgs } from '@remix-run/node'
import { Await, Form, useLoaderData } from '@remix-run/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { SectionReference } from '~/features/sangokushi/components/SectionReference'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { vectorSearch } from '~/features/sangokushi/services/vector-search.server'

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
        result: Awaited<ReturnType<typeof vectorSearch>>['result']['0'][]
        usage: number
      },
    })
  }

  const vectorResult = vectorSearch(input, 10)
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
    <Box
      bgColor="gray.100"
      minH="100dvh"
      display="grid"
      gridTemplateRows="auto 1fr auto"
    >
      <Box textAlign="center" bgColor="white" px="2" py="4">
        <Heading>三国志 GPT</Heading>
      </Box>

      <Container py="4" px="2" maxW="container.lg" position="relative">
        <Stack>
          <Form onSubmit={(e) => handleFormSubmit(e)}>
            <HStack align="end">
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
                isLoading={generator.isLoading}
              >
                Query
              </Button>
            </HStack>
          </Form>

          <Flex justify="end">
            <React.Suspense
              fallback={
                <Text color="gray.700" fontSize="sm">
                  Loading..
                </Text>
              }
            >
              <Await
                resolve={loaderData.vectorResult}
                errorElement={<div>Error</div>}
              >
                {(vectorResult) => (
                  <HStack fontSize="sm" align="center" flexWrap="wrap">
                    {vectorResult.result.slice(0, 1).map((result) => {
                      return (
                        <SectionReference
                          key={result.id}
                          section={result.section}
                        >
                          <Box
                            fontSize="xs"
                            fontWeight="extrabold"
                            color="green.500"
                          >
                            {Math.round(result.score * 1000) / 10}
                            <small>%</small> Match
                          </Box>
                        </SectionReference>
                      )
                    })}
                  </HStack>
                )}
              </Await>
            </React.Suspense>
          </Flex>

          <Grid gridTemplateColumns="auto auto 1fr" gap="4">
            {nl2br(generator.data)}
          </Grid>
        </Stack>

        {/* <Box position="absolute" bottom="0">
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => {
              generator.abort()
            }}
          >
            生成をキャンセル
          </Button>
        </Box> */}
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
