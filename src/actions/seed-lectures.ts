import { boot } from '@/boot'
import Config from '@/config'
import timetableSeeder from '@/db/seeders/timetable-seeder'
import argv from '@/dev/argv'
import getSemester from '@/modules/get-semester'
import { Semester } from '@/types'
import { CTTS } from '@payw/cau-timetable-scraper'
import chalk from 'chalk'
import dayjs from 'dayjs'
import fs from 'fs'

async function main(): Promise<void> {
  const args = argv<{
    y: string
    year: string
    semester: string
    s: string
    D: undefined
    file: string
  }>()

  const isDev = 'D' in args

  await boot({
    db: true,
    isDev,
    listen: false,
  })

  const year = Number(args.year) || Number(args.y) || dayjs().year()
  const semester =
    (args.semester as Semester) || (args.s as Semester) || getSemester()

  console.log(
    `[ ${chalk.blue('seeding')} ] seeding lectures: ${year}, ${semester}`
  )

  let lectures

  if (args.file) {
    lectures = JSON.parse(fs.readFileSync(args.file, 'utf8'))
    console.log(lectures)
  } else {
    lectures = await CTTS(
      {
        id: Config.CAU_ID,
        pw: Config.CAU_PW,
      },
      {
        year,
        semester,
      }
    )

    fs.writeFileSync(
      `data/lectures-${year}-${semester}.json`,
      JSON.stringify(lectures, null, 2)
    )
  }

  await timetableSeeder(lectures)

  console.log(`[ ${chalk.blue('seeding')} ] Done seeding lectures`)
}

main()
