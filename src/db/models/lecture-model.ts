export interface LectureModel extends Record<string, string | number> {
  id: string
  year: number
  semester: string
  campus: string
  college: string
  major: string
  grade: number
  credit: number
  course: string
  section: string
  code: string
  name: string
  professor: string
  schedule: string
  building: string
  room: string
  note: string
}

export interface PeriodModel extends Record<string, string | number> {
  lecture_id: string
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  start_h: number
  start_m: number
  end_h: number
  end_m: number
}

export interface CoverageMajorLectureModel
  extends Record<string, string | number> {
  lecture_id: string
  coverage_major: string
}
