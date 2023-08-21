import { Link } from '@remix-run/react'
import React from 'react'
import { Heading } from '~/components/ui'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-slate-200">
      <header className="container bg-background py-2">
        <Heading>三国志 GPT</Heading>
      </header>

      <main className="container relative py-4">{children}</main>

      <footer className="container bg-background py-2 text-center">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <Link to="https://twitter.com/techtalkjp/" target="_blank" color="blue.500">
          coji
        </Link>
        <div>
          <Link to="https://github.com/coji/sangokushi-gpt" target="_blank" color="blue.500">
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  )
}
