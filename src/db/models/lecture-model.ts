import Db from '..'

// Lecture
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

const createLectureTableSql = `
CREATE TABLE lecture (
  id char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  year smallint DEFAULT NULL,
  semester varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  campus varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  college varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  major varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  grade tinyint DEFAULT NULL,
  credit tinyint DEFAULT NULL,
  course varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  section varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  code varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  professor varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  schedule varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  building varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  room varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  note text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createLectureTable(): Promise<void> {
  await Db.query(createLectureTableSql)
}

// Period
export interface PeriodModel extends Record<string, string | number> {
  lecture_id: string
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  start_h: number
  start_m: number
  end_h: number
  end_m: number
}

const createPeriodTableSql = `
CREATE TABLE period (
  lecture_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  day char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  start_h tinyint NOT NULL,
  start_m tinyint NOT NULL,
  end_h tinyint NOT NULL,
  end_m tinyint NOT NULL,
  PRIMARY KEY (lecture_id,day,start_h,start_m,end_h,end_m),
  CONSTRAINT fk_period_lecture_id FOREIGN KEY (lecture_id) REFERENCES lecture (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createPeriodTable(): Promise<void> {
  await Db.query(createPeriodTableSql)
}

// Coverage College
export interface CoverageCollegeModel extends Record<string, string | number> {
  name: string
}

const createCoverageCollegeTableSql = `
CREATE TABLE coverage_college (
  name varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createCoverageCollegeTable(): Promise<void> {
  await Db.query(createCoverageCollegeTableSql)
}

// Coverage Major
export interface CoverageMajorModel extends Record<string, string | number> {
  name: string
  coverage_college: string
}

const createCoverageMajorTableSql = `
CREATE TABLE coverage_major (
  name varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  coverage_college varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (name),
  KEY fk_coverage_college (coverage_college),
  CONSTRAINT fk_coverage_college FOREIGN KEY (coverage_college) REFERENCES coverage_college (name) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createCoverageMajorTable(): Promise<void> {
  await Db.query(createCoverageMajorTableSql)
}

// Coverage Major Lecture
export interface CoverageMajorLectureModel
  extends Record<string, string | number> {
  lecture_id: string
  coverage_major: string
}

const createCoverageMajorLectureTableSql = `
CREATE TABLE coverage_major_lecture (
  lecture_id char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  coverage_major char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  KEY lecture_id (lecture_id),
  KEY coverage_major (coverage_major),
  CONSTRAINT fk_coverage_major FOREIGN KEY (coverage_major) REFERENCES coverage_major (name) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lecture_id FOREIGN KEY (lecture_id) REFERENCES lecture (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function createCoverageMajorLectureTable(): Promise<void> {
  await Db.query(createCoverageMajorLectureTableSql)
}
