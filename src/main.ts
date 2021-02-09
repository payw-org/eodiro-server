import 'reflect-metadata'
import { boot } from './boot'

async function main() {
  await boot()
}

main()

process.on('SIGTERM', () => {
  process.exit()
})
