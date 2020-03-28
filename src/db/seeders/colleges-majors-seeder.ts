import { CoverageMajorType } from '@/database/models/coverage_major'
import { TableNames } from '@/database/table-names'
import SqlB from '@/modules/sqlb'
import Db from '..'

const collegesMajorsSeeder = async (
  colleges: {
    college: string
    majors: {
      majorName: string
      majorCode: string
    }[]
  }[]
) => {
  for (const college of colleges) {
    const collegeName = college.college

    if (college.majors.length === 0) {
      continue
    }

    const majors = college.majors.map((major) => {
      return {
        coverage_college: collegeName,
        name: major.majorName,
        code: major.majorCode,
      }
    })

    const sqlB = SqlB<CoverageMajorType>().bulkInsert(
      TableNames.coverage_major,
      majors,
      'update'
    )

    await Db.query(sqlB)
  }
}

export default collegesMajorsSeeder
