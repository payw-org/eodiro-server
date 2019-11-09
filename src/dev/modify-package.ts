/**
 * modify-package.js
 * Jang Haemin 2019 MIT
 */

import fs from 'fs'

const m = JSON.parse(fs.readFileSync('package.json').toString())

if (process.env.NODE_ENV === 'development') {
  m._moduleAliases['@'] = 'src'
  m._moduleAliases['@@'] = '.'
} else {
  m._moduleAliases['@'] = 'build/src'
  m._moduleAliases['@@'] = 'build'
}

fs.writeFile('package.json', JSON.stringify(m, null, 2) + '\n', () => {})
