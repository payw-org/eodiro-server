// TODO: Rewrite the script with Prisma
// current script won't work due to the different attribute names

import Db from '@/db'
import { Q } from '@/modules/sqlb'
import { CoverageMajorLecture, Lecture, Period } from '@/prisma/client'
import { RefinedLectures } from '@payw/cau-timetable-scraper/build/types'
import { v4 as uuidv4 } from 'uuid'

export default async function (lectures: RefinedLectures): Promise<void> {
  console.log('🌱 Seeding lectures')

  const firstLecture = lectures[0]

  if (!firstLecture) {
    console.log(`🌱 Stop seeding, first lecture doesn't exist`)
    return
  }

  // Update college coverage data
  const dbLectures: Lecture[] = []
  const dbPeriods: Period[] = []
  const dbCoverageMajorLectures: CoverageMajorLecture[] = []

  for (let i = 0; i < lectures.length; i += 1) {
    const lecture = lectures[i]
    const lectureId = uuidv4()

    dbLectures.push({
      id: lectureId,
      year: lecture.year,
      semester: lecture.semester,
      campus: lecture.campus,
      college: lecture.college,
      major: lecture.major || null,
      grade: lecture.grade,
      credit: lecture.credit,
      course: lecture.course,
      section: lecture.section,
      code: lecture.code,
      name: lecture.name,
      professor: lecture.professor,
      schedule: lecture.schedule,
      building: parseInt(lecture.building) || null,
      room: lecture.room || null,
      note: lecture.note,
    })

    for (let j = 0; j < lecture.periods.length; j += 1) {
      const period = lecture.periods[j]

      dbPeriods.push({
        day: period.day,
        lectureId: lectureId,
        startH: period.startH,
        startM: period.startM,
        endH: period.endH,
        endM: period.endM,
      })
    }

    for (let j = 0; j < lecture.coverages.length; j += 1) {
      const coverage = lecture.coverages[j]

      if (!coverage.majorCode) {
        continue
      }

      dbCoverageMajorLectures.push({
        lectureId: lectureId,
        majorCode: coverage.majorCode,
      })
    }
  }

  // Delete all lectures before rewrite
  const year = firstLecture.year
  const semester = firstLecture.semester

  console.log('Clearing data...')
  const [clearErr] = await Db.query(
    `DELETE FROM lecture WHERE year=${year} AND semester='${semester}'`
  )
  if (clearErr) {
    console.error('Failed to clearing data')
    console.error(clearErr)
    return
  }

  console.log('Inserting lectures...')
  const [insertLecturesErr] = await Db.query(
    Q().bulkInsert('lecture', dbLectures).build()
  )
  if (insertLecturesErr) {
    console.error('Failed to insert lectures')
    console.error(insertLecturesErr)
    return
  }

  console.log('Inserting periods...')
  const [insertPeriodsErr] = await Db.query(
    Q().bulkInsert('period', dbPeriods).build()
  )
  if (insertPeriodsErr) {
    console.error('Failed to insert periods')
    console.error(insertPeriodsErr)
    return
  }

  console.log('Inserting coverage major lecture relations...')
  const [insertRelationsErr] = await Db.query(
    Q().bulkInsert('coverage_major_lecture', dbCoverageMajorLectures).build()
  )
  if (insertRelationsErr) {
    console.log('Failed to insert relations')
    console.log(insertRelationsErr)
    return
  }

  console.log('🌱 Done Seeding lectures')
}
