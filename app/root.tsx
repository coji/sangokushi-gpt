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
  { title: '三国志GPT' },
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { name: 'description', content: '三国志についてなんでも質問できる GPT です' },
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
