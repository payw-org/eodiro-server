import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'

class CoverageMajorLecture extends Model {}

export const coverageMajorLecture = createInitModelFunction(
  CoverageMajorLecture,
  'coverage_major_lecture',
  {
    lecture_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      references: {
        model: 'lecture',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    major_code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      references: {
        model: 'coverage_major',
        key: 'code',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  },
  {
    indexes: [
      {
        fields: ['lecture_id'],
      },
      {
        fields: ['major_code'],
      },
    ],
  }
)

export type CoverageMajorLectureType = {
  lecture_id: string
  major_code: string
}
