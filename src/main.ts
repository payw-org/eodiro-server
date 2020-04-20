import 'reflect-metadata'
import { boot } from './boot'

async function main() {
  await boot({
    db: true,
    mail: true,
    bot: true,
    listen: true,
  })
}

main()
