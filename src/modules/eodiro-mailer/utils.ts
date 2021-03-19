export const html = (s: TemplateStringsArray, ...args: unknown[]) =>
  s.map((ss, i) => `${ss}${args[i] || ''}`).join('')
