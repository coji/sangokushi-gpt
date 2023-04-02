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
} from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import nl2br from 'react-nl2br'
import { useGenerator } from '~/features/sangokushi/hooks/useGenerator'
import { vectorSearch } from '~/features/sangokushi/services/vector-search.server'

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

  const { result, usage } = await vectorSearch(input)
  return json({ input, result, usage })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const generator = useGenerator()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const input = String(formData.get('input'))
    void generator.generate(input)
  }

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
          <form onSubmit={(e) => handleFormSubmit(e)}>
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
                isLoading={generator.isLoading}
              >
                Query
              </Button>
            </HStack>
          </form>

          <Grid gridTemplateColumns="auto auto 1fr" gap="4">
            {nl2br(generator.data)}
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
