import { Link, Outlet, useLocation, useNavigate } from '@remix-run/react'
import { match } from 'ts-pattern'
import { HStack, Heading, Tabs, TabsList, TabsTrigger } from '~/components/ui'

export const AppLayout = () => {
  const location = useLocation()
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

            <Tabs value={tab}>
              <TabsList>
                <TabsTrigger value="/" asChild>
                  <Link to="/">ストーリー生成</Link>
                </TabsTrigger>
                <TabsTrigger value="/search" asChild>
                  <Link to="/search">検索</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </HStack>
        </div>
      </header>

      <main className="relative px-2 py-4 md:container">
        <Outlet />
      </main>

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
export default AppLayout
