import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'

class CoverageMajorLecture extends Model {}

export const coverageMajorLecture = createGetModelFunction(
  CoverageMajorLecture,
  'coverage_major_lecture',
  {
    lecture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lecture',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    coverage_major: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'coverage_major',
        key: 'name',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  }
)

export type CoverageMajorLectureType = {
  lecture_id: number
  coverage_major: string
}
