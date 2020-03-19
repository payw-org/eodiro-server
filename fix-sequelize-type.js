// Delete this script after Sequelize 6 resolved the problem

const fs = require('fs')
const filePath = 'node_modules/sequelize/types/lib/query-interface.d.ts'

const errLine1 = `import { SetRequired } from './../type-helpers/set-required';`
const errLine2 = `options: SetRequired<QueryInterfaceIndexOptions, 'fields'>,`

const queryInterfaceTs = fs.readFileSync(filePath, 'utf8')
const resolved = queryInterfaceTs
  .replace(errLine1, '')
  .replace(errLine2, `options: any,`)

fs.writeFileSync(filePath, resolved)
