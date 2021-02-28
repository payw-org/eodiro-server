// TODO: Rewrite the script with Prisma
// current script won't work due to the different attribute names

import SqlB from '@/modules/sqlb'
import { CoverageMajor } from '@/prisma/client'
import Db from '..'

export type College = {
  college: string
  majors: {
    majorName: string
    majorCode: string
  }[]
}

const collegesMajorsSeeder = async (colleges: College[]): Promise<void> => {
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

    const sqlB = SqlB<CoverageMajor>().bulkInsert(
      'coverage_major',
      majors,
      'update'
    )

    await Db.query(sqlB)
  }
}

export default collegesMajorsSeeder
