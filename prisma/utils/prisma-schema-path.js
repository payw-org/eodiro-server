const fs = require('fs')
const appRoot = require('app-root-path')
const prismaSchemaPath = appRoot.resolve('/prisma/schema.prisma')

module.exports = {
  prismaSchemaPath,
  file: fs.readFileSync(prismaSchemaPath, {
    encoding: 'utf8',
  }),
}
