require('module-alias/register')
import { boot } from '@/boot'
import timetableSeeder from '@/db/seeders/timetable-seeder'
import argv from '@/dev/argv'
import getSemester from '@/modules/get-semester'
import { Semester } from '@/types'
import Config from '@@/config'
import { CTTS } from '@payw/cau-timetable-scraper'
import dayjs from 'dayjs'

async function main(): Promise<void> {
  const args = argv<{
    y: string
    year: string
    semester: string
    s: string
    D: undefined
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

  console.log(`Seeding lectures: ${year}, ${semester}`)

  const lectures = await CTTS(
    {
      id: Config.CAU_ID,
      pw: Config.CAU_PW,
    },
    {
      year,
      semester,
    }
  )

  await timetableSeeder(lectures)

  console.log(`Done seeding lectures`)
}

main()
