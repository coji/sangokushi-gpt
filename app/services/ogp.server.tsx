// ./app/utils/createOGImage.tsx
import { Resvg } from '@resvg/resvg-js'
import type { SatoriOptions } from 'satori'
import satori from 'satori'
import { SangokushiLogo } from '~/components/Logo'

// Load the font from the "public" directory
const fontSans = (baseUrl: string) =>
  fetch(new URL(`${baseUrl}/fonts/NotoSansJP-Bold.otf`)).then((res) =>
    res.arrayBuffer(),
  )

export async function createOGImage(title: string, requestUrl: string) {
  const fontSansData = await fontSans(requestUrl)
  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'NotoSansJP',
        data: fontSansData,
        style: 'normal',
      },
    ],
    embedFont: true,
  }

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <div
      style={{
        width: '1200',
        height: '630',
        color: 'white',
        backgroundColor: 'black',
        fontFamily: 'NotoSansJP',
        fontSize: 100,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SangokushiLogo />
      <div style={{ fontSize: '200' }}>{title}</div>
    </div>,
    options,
  )

  // Convert the SVG to PNG with "resvg"
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}
