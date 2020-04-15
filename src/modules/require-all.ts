import fs from 'fs'

function requireAll<T>(dir: string, filter: (fileName: string) => {}): T[] {
  const modules = []
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    const filePath = dir + '/' + fileName
    if (fs.statSync(filePath).isDirectory()) {
      modules.push(...requireAll<T>(filePath, filter))
    } else {
      if (filter(fileName)) {
        modules.push(require(filePath).default)
      }
    }
  }
  return modules
}
export default requireAll
