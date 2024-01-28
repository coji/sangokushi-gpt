import { Link, useLocation, useNavigate } from '@remix-run/react'
import React from 'react'
import { match } from 'ts-pattern'
import { HStack, Heading, Tabs, TabsList, TabsTrigger } from '~/components/ui'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const tab = match(location.pathname)
    .when(
      (v) => v.startsWith('/search'),
      () => '/search',
    )
    .otherwise(() => '/')

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200">
      <header className="flex items-center bg-background py-2">
        <div className="container">
          <HStack>
            <Heading>
              <Link to="/">三国志 GPT</Link>
            </Heading>

            <Tabs
              value={tab}
              onValueChange={(val) => {
                navigate(val)
              }}
            >
              <TabsList>
                <TabsTrigger value="/">ストーリー生成</TabsTrigger>
                <TabsTrigger value="/search">検索</TabsTrigger>
              </TabsList>
            </Tabs>
          </HStack>
        </div>
      </header>

      <main className="relative px-2 py-4 md:container">{children}</main>

      <footer className="bg-background py-2 text-center">
        <div className="container">
          Copyright &copy; {new Date().getFullYear()}{' '}
          <Link
            to="https://twitter.com/techtalkjp/"
            target="_blank"
            color="blue.500"
          >
            coji
          </Link>
          <div>
            <Link
              to="https://github.com/coji/sangokushi-gpt"
              target="_blank"
              color="blue.500"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
