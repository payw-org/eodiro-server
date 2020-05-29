import 'reflect-metadata'

import { boot } from './boot'

async function main() {
  await boot({
    db: true,
    mail: true,
    listen: true,
  })
}

main()
