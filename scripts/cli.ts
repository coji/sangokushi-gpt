import { cli, command } from 'cleye'
import { match } from 'ts-pattern'
import { $ } from 'zx'

const argv = cli({
  commands: [
    command({ name: 'cleanup' }),
    command({ name: 'structure' }),
    command({ name: 'embed' }),
    command({ name: 'qdrant-upsert' }),
  ],
})

const main = async () => {
  await match(argv.command)
    .with('cleanup', async () => {
      await $`tsx scripts/convert/01_clean.ts`
    })
    .with('structure', async () => {
      await $`tsx scripts/convert/02_structure.ts`
    })
    .with('embed', async () => {
      await $`tsx scripts/convert/03_embed.ts`
    })
    .with('qdrant-upsert', async () => {
      await $`tsx scripts/convert/04_qdrant-upsert-index.ts`
    })
    .otherwise(() => {
      argv.showHelp()
    })
}

void main()
