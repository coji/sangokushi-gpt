import { ExternalLinkIcon } from '@chakra-ui/icons'
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react'
import { defer, type LoaderArgs } from '@remix-run/node'
import { Await, Form, useLoaderData } from '@remix-run/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { vectorSearch } from '~/features/sangokushi/services/vector-search.server'

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const input = url.searchParams.get('input')
  if (!input) {
    return defer({
      input: '',
      vectorResult: null,
    })
  }

  const vectorResult = vectorSearch(input, 10)
  return defer({ input, vectorResult })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const generator = useGenerator()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const input = String(formData.get('input'))
    void generator.generate(input)
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
            <React.Suspense fallback={<p>Loading reviews...</p>}>
              <Await
                resolve={loaderData.vectorResult}
                errorElement={<div>Error</div>}
              >
                {(vectorResult) => (
                  <HStack fontSize="sm" align="center" flexWrap="wrap">
                    {vectorResult?.result.slice(0, 1).map((result) => {
                      return (
                        <React.Fragment key={result.id}>
                          <Box
                            fontSize="xs"
                            fontWeight="extrabold"
                            color="green.500"
                          >
                            {Math.round(result.score * 1000) / 10}
                            <small>%</small> Match
                          </Box>
                          <Text color="gray.700">
                            吉川英治 「三国志」{' '}
                            {result.section.volumeTitle.trim()}
                          </Text>

                          <Popover trigger="hover">
                            <PopoverTrigger>
                              <Button
                                size="xs"
                                colorScheme="blue"
                                variant="outline"
                              >
                                原文
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>
                                <HStack>
                                  <Text>{result.section.chapterNumber}</Text>
                                  <Text>{result.section.chapterTitle}</Text>
                                  <Text>{result.section.sectionNumber}</Text>
                                  <Button
                                    as="a"
                                    rightIcon={<ExternalLinkIcon />}
                                    href="https://github.com/coji/sangokushi-gpt/blob/main/app/features/sangokushi/actions/generate-action.server.ts#L14"
                                    target="_blank"
                                    size="xs"
                                    variant="outline"
                                    colorScheme="blue"
                                  >
                                    Prompt
                                  </Button>{' '}
                                </HStack>
                              </PopoverHeader>
                              <PopoverBody>
                                <Box overflow="auto" height="20rem">
                                  {nl2br(result.section.content)}
                                </Box>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </React.Fragment>
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
