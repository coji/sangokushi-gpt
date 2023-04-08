import { cli, command } from 'cleye'
import { match } from 'ts-pattern'
import { $ } from 'zx'

const argv = cli({
  name: 'build-index',
  commands: [
    command({ name: 'cleanup' }),
    command({ name: 'structure' }),
    command({ name: 'embed' }),
    command({ name: 'build-index' }),
  ],
})

const main = async () => {
  await match(argv.command)
    .with('cleanup', async () => {
      await $`tsx scripts/convert/clean.ts`
    })
    .with('structure', async () => {
      await $`tsx scripts/convert/structure.ts`
    })
    .with('embed', async () => {
      await $`tsx scripts/convert/embed.ts`
    })
    .with('build-index', async () => {
      await $`tsx scripts/convert/qdrant-upsert-index.ts`
    })
    .otherwise(() => {
      argv.showHelp()
    })
}

void main()
