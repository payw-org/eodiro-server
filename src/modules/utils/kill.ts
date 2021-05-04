import { exec } from 'node:child_process'

export default function kill(query: string): void {
  exec(`sudo kill -9 $(pgrep -f ${query})`)
}
