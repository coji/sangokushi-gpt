import { ChakraProvider } from '@chakra-ui/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { V2_MetaFunction } from '@vercel/remix'

export const meta: V2_MetaFunction = () => [
  { title: '三国志 GPT' },
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  {
    name: 'description',
    content: '三国志についてなんでも答えてくれる GPT です',
  },
  { property: 'og:title', content: '三国志 GPT' },
  { property: 'og:url', content: 'https://sangokushi-gpt.vercel.app/' },
  {
    property: 'og:description',
    content: '三国志についてなんでも答えてくれる GPT です',
  },
  {
    property: 'og:image',
    content: 'https://sangokushi-gpt.vercel.app/resource/ogp',
  },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:twitter:card', content: 'summary_large_image' },
  { property: 'og:twitter:site', content: '@techtalkjp' },
]

interface DocumentProps {
  children: React.ReactNode
}

const Document = ({ children }: DocumentProps) => {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <ChakraProvider resetCSS>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}
