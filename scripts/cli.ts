import { cli, command } from 'cleye'
import { match } from 'ts-pattern'
import { $ } from 'zx'

const argv = cli({
  commands: [command({ name: 'cleanup' }), command({ name: 'structure' })],
})

const main = async () => {
  await match(argv.command)
    .with('cleanup', async () => {
      await $`tsx scripts/convert/01_clean.ts`
    })
    .with('structure', async () => {
      await $`tsx scripts/convert/02_structure.ts`
    })
    .otherwise(() => {
      argv.showHelp()
    })
}

void main()
