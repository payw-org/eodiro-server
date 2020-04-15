const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const appRoot = require('app-root-path')
const prettier = require('prettier')
const prettierConfig = require(appRoot.resolve('prettier.config.js'))
prettierConfig.parser = 'typescript'

const codegenConfig = yaml.parse(fs.readFileSync('codegen.yml', 'utf8'))
const genPath = Object.keys(codegenConfig.generates)[0]

const typesPath = appRoot.resolve(genPath)

const types = fs.readFileSync(typesPath, 'utf8')
const schemas = Object.keys(codegenConfig.generates[genPath].config.mappers)

let cleaned = types
for (const schema of schemas) {
  const regExp = new RegExp(`export type ${schema} = {[\\s\\S]*?}`, 'gm')
  cleaned = cleaned.replace(regExp, '')
}

// Format the result with Prettier
// cleaned = prettier.format(cleaned, prettierConfig)

fs.writeFileSync(typesPath, cleaned, {
  encoding: 'utf8',
})
