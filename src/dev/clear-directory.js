const fs = require('fs')
const path = require('path')

/**
 * @param {string} directory
 */
module.exports = function(directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    fs.unlinkSync(path.join(directory, file))
  }
}
