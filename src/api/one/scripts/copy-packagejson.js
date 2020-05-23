const fs = require('fs')
const appRoot = require('app-root-path')
const path = require('path')

fs.copyFileSync(
  path.resolve(__dirname, '../package.json'),
  appRoot.resolve('/build/src/package.json')
)
