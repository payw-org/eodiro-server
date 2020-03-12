const fs = require('fs')
const appRoot = require('app-root-path')
const chalk = require('chalk')
const log = console.log

fs.symlink(
  appRoot.resolve('/src/db/schema'),
  appRoot.resolve('/src/api/eodiro-one-api/db-schema'),
  (err) => {
    if (err && err.code === 'EEXIST') {
      log(
        `[ ${chalk.magenta(
          'symlink'
        )} ] 'db-schema' already exists in 'one-api'`
      )
    } else {
      log(`[ ${chalk.magenta('symlink')} ] symlinked 'db-schema' to 'one-api'`)
    }
  }
)
