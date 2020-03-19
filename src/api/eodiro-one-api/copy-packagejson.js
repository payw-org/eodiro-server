const fs = require('fs')
const appRoot = require('app-root-path')

fs.copyFileSync('package.json', appRoot.resolve('/build/package.json'))
