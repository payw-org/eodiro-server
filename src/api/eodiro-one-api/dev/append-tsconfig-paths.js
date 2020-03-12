const fs = require('fs')

const tsConf = JSON.parse(fs.readFileSync('tsconfig.json').toString())

tsConf.compilerOptions.baseUrl = '../../../'
tsConf.compilerOptions.paths = {
  '@/*': ['./src/*'],
}

fs.writeFile('tsconfig.json', JSON.stringify(tsConf, null, 2) + '\n', () => {})
