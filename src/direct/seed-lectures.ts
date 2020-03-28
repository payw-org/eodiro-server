import { boot } from '@/boot'
import Config from '@/config'
import collegesMajorsSeeder from '@/db/seeders/colleges-majors-seeder'
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
    collegesFile: string
    lecturesFile: string
  }>()

  await boot({
    db: true,
    listen: false,
  })

  const year = Number(args.year) || Number(args.y) || dayjs().year()
  const semester =
    (args.semester as Semester) || (args.s as Semester) || getSemester()

  console.log(
    `[ ${chalk.blue('seeding')} ] seeding lectures: ${year}, ${semester}`
  )

  if (!args.collegesFile && !args.lecturesFile) {
    console.log('Scraping from server')
    const { colleges, lectures } = await CTTS(
      {
        id: Config.CAU_ID,
        pw: Config.CAU_PW,
      },
      {
        year,
        semester,
      }
    )

    const timestamp = new Date().getTime()

    fs.writeFileSync(
      `data/colleges-${timestamp}.json`,
      JSON.stringify(colleges, null, 2)
    )
    fs.writeFileSync(
      `data/lectures-${year}-${semester}-${timestamp}.json`,
      JSON.stringify(lectures, null, 2)
    )

    await collegesMajorsSeeder(colleges)
    await timetableSeeder(lectures)
  } else {
    if (args.collegesFile) {
      console.log('Colleges file is given')
      const colleges = JSON.parse(fs.readFileSync(args.collegesFile, 'utf8'))
      await collegesMajorsSeeder(colleges)
    }
    if (args.lecturesFile) {
      console.log('Lectures file is given')
      const lectures = JSON.parse(fs.readFileSync(args.lecturesFile, 'utf8'))
      await timetableSeeder(lectures)
    }
  }

  console.log(`[ ${chalk.blue('seeding')} ] Done seeding lectures`)
}

main()
