import { useState } from 'react'

interface GeneratorState {
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

export const useGenerator = () => {
  const [data, setData] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [state, setState] = useState<GeneratorState>({
    isLoading: false,
    isError: false,
    isSuccess: false,
  })
  const abortController = new AbortController()

  const generate = async (input: string) => {
    setState({ isLoading: true, isError: false, isSuccess: false })
    setData(undefined)

    const formData = new FormData()
    formData.set('input', input)

    try {
      console.log('fetch', abortController)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
      }).catch((e) => {
        console.log('fetch error:', e)
        return null
      })

      console.log('fetch done', abortController)

      if (!response || !response.ok) {
        throw new Error(response?.statusText)
      }

      const data = response.body
      if (!data) {
        throw new Error('empty response')
      }

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        setData((prev) => (prev ?? '') + chunkValue)
      }

      setState((prev) => ({ ...prev, isError: false, isSuccess: true }))
    } catch (e) {
      let errorMessage = ''
      if (e instanceof Error) {
        errorMessage += e.message
      }
      console.log('error', e)
      setError(errorMessage)
      setState((prev) => ({ ...prev, isError: true, isSuccess: false }))
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const abort = () => {
    console.log('abort', abortController)
    abortController.abort()
    console.log('aborted', abortController)
  }

  return {
    data,
    error,
    ...state,
    generate,
    abort,
  }
}
