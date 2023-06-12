import { ChakraProvider } from '@chakra-ui/react'
import { json, type V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { keepAwake } from './services/shrink-to-zero.server'

export const meta: V2_MetaFunction = () => [
  { title: '三国志 GPT' },
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  {
    name: 'description',
    content: '三国志についてなんでも答えてくれる GPT です',
  },
  { property: 'og:title', content: '三国志 GPT' },
  { property: 'og:url', content: 'https://sangokushi-gpt.fly.dev/' },
  {
    property: 'og:description',
    content: '三国志についてなんでも答えてくれる GPT です',
  },
  {
    property: 'og:image',
    content: 'https://sangokushi-gpt.fly.dev/resource/ogp',
  },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:twitter:card', content: 'summary_large_image' },
  { property: 'og:twitter:site', content: '@techtalkjp' },
]

export const loader = () => {
  keepAwake()
  return json({})
}

export default function App() {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider resetCSS>
          <Outlet />
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
