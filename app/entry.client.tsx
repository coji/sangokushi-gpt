import createEmotionCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrate as reactHydrate } from 'react-dom'

const hydrate = () => {
  const emotionCache = createEmotionCache({ key: 'css' })

  startTransition(() => {
    reactHydrate(
      <StrictMode>
        <CacheProvider value={emotionCache}>
          <RemixBrowser />
        </CacheProvider>
      </StrictMode>,
      document,
    )
  })
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1)
}
