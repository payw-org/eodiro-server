import { RefinedLectures } from '@payw/cau-timetable-scraper/build/src/types'
import Db from '@/db'
import SqlB from '@/modules/sqlb'
import uuid from 'uuid'
import { LectureModel, PeriodModel } from '@/db/models'

export default async function(lectures: RefinedLectures): Promise<void> {
  console.log('Seeding lectures')
  // const lectures: Lectures = lecturesJson
  const sqlB = SqlB()

  const firstLecture = lectures[0]
  const year = firstLecture.year
  const semester = firstLecture.semester

  // Delete all lectures and rewrite
  await Db.query(
    `DELETE FROM lecture WHERE year=${year} AND semester='${semester}'`
  )

  // Update college coverage data
  const coverageColleges = []
  const coverageMajors = []
  const dbLectures: LectureModel[] = []
  const dbPeriods: PeriodModel[] = []

  for (let i = 0; i < lectures.length; i += 1) {
    const lecture = lectures[i]
    const lectureId = uuid.v4()

    dbLectures.push({
      id: lectureId,
      year: lecture.year,
      semester: lecture.semester,
      campus: lecture.campus,
      college: lecture.college,
      major: lecture.major,
      grade: lecture.grade,
      credit: lecture.credit,
      course: lecture.course,
      section: lecture.section,
      code: lecture.code,
      name: lecture.name,
      professor: lecture.professor,
      schedule: lecture.schedule,
      building: lecture.building,
      room: lecture.room,
      note: lecture.name,
    })

    for (let j = 0; j < lecture.periods.length; j += 1) {
      const period = lecture.periods[j]

      dbPeriods.push({
        day: period.day,
        lecture_id: lectureId,
        start_h: period.startH,
        start_m: period.startM,
        end_h: period.endH,
        end_m: period.endM,
      })
    }

    // Multiple coverages for a single lecture
    for (let j = 0; j < lecture.coverages.length; j += 1) {
      const coverage = lecture.coverages[j]
      if (
        coverageColleges.findIndex((item) => {
          return item?.name === coverage.college
        }) === -1
      ) {
        coverageColleges.push({
          name: coverage.college,
        })
      }
      if (
        coverageMajors.findIndex((item) => {
          return item?.name === coverage.major
        }) === -1
      ) {
        coverageMajors.push({
          name: coverage.major,
          coverage_college: coverage.college,
        })
      }
    }
  }

  await Db.query(
    sqlB.insertBulk(`coverage_college`, coverageColleges, true).build()
  )
  await Db.query(
    sqlB.insertBulk(`coverage_major`, coverageMajors, true).build()
  )
  await Db.query(sqlB.insertBulk(`lecture`, dbLectures).build())
  await Db.query(sqlB.insertBulk(`period`, dbPeriods).build())

  console.log('Done Seeding lectures')
}
