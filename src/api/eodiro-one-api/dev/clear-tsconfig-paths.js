const fs = require('fs')

const tsConf = JSON.parse(fs.readFileSync('tsconfig.json').toString())

delete tsConf.compilerOptions.baseUrl
delete tsConf.compilerOptions.paths

fs.writeFile('tsconfig.json', JSON.stringify(tsConf, null, 2) + '\n', () => {})
