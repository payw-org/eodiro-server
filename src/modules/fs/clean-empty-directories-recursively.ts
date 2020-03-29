import fs from 'fs'
import path from 'path'

export function cleanEmptyDirectoriesRecursively(dir: string) {
  console.log(dir)
  const isDir = fs.statSync(dir).isDirectory()
  if (!isDir) {
    return
  }

  const hiddenFileRegEx = /(^|\/)\.[^\/\.]/g
  let files = fs.readdirSync(dir).filter((file) => !hiddenFileRegEx.test(file))

  if (files.length > 0) {
    files.forEach(function (file) {
      const fullPath = path.join(dir, file)
      cleanEmptyDirectoriesRecursively(fullPath)
    })

    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = fs.readdirSync(dir)
  }

  if (files.length === 0) {
    fs.rmdirSync(dir, { recursive: true })
    return
  }
}
