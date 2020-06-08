export default function argv<T = Record<string, unknown>>(): T {
  const args = {}
  const rawArgs = process.argv.slice(2, process.argv.length)
  rawArgs.forEach((arg: string, index) => {
    // Long arguments with '--' flags:
    if (arg.slice(0, 2).includes('--')) {
      const longArgKey = arg.slice(2, arg.length)
      const longArgValue = rawArgs[index + 1] // Next value, e.g.: --connection connection_name
      args[longArgKey] = longArgValue
    }
    // Short arguments with '-' flags:
    else if (arg.slice(0, 1).includes('-')) {
      const longArgKey = arg.slice(1, arg.length)
      const longArgValue = rawArgs[index + 1] // Next value, e.g.: -c connection_name
      args[longArgKey] = longArgValue
    }
  })

  return args as T
}
