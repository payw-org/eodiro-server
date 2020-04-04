import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class Lecture extends Model {}

export const lecture = createInitModelFunction(Lecture, 'lecture', {
  id: PrimaryAIAttribute,
  year: DataTypes.SMALLINT,
  semester: DataTypes.STRING(10),
  campus: DataTypes.STRING(10),
  college: DataTypes.STRING(50),
  major: DataTypes.STRING(50),
  grade: DataTypes.TINYINT,
  credit: DataTypes.TINYINT,
  course: DataTypes.STRING(50),
  section: DataTypes.STRING(50),
  code: DataTypes.STRING(50),
  name: DataTypes.STRING(100),
  professor: DataTypes.STRING(50),
  schedule: DataTypes.STRING(150),
  building: DataTypes.SMALLINT,
  room: DataTypes.STRING(20),
  note: DataTypes.TEXT,
})

export type LectureType = {
  id: number
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
  building: number
  room: string
  note: string
}
