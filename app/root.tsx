import { type LinksFunction, type MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import globalStyles from './styles/globals.css'

export const meta: MetaFunction = () => [
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

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
]

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
