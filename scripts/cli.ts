import { cli, command } from 'cleye'
import { match } from 'ts-pattern'
import {
  cleanText,
  embedSections,
  structureSections,
  upsertSections,
} from './convert'

const argv = cli({
  commands: [
    command({ name: 'cleanup' }),
    command({ name: 'structure' }),
    command({ name: 'embed' }),
    command({ name: 'upsert' }),
  ],
})

const main = async () => {
  await match(argv.command)
    .with('cleanup', async () => {
      await cleanText()
    })
    .with('structure', async () => {
      await structureSections()
    })
    .with('embed', async () => {
      await embedSections()
    })
    .with('upsert', async () => {
      await upsertSections()
    })
    .otherwise(() => {
      argv.showHelp()
    })
}

void main()
