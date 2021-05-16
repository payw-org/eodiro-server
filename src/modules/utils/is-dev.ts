/**
 * @deprecated Use `isDev` constant instead.
 */
export function isDevFunction(): boolean {
  return process.env.NODE_ENV === 'development'
}

export const isDev = process.env.NODE_ENV === 'development'
