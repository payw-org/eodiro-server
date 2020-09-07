import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class CoverageMajorLecture extends Model {}

export const coverageMajorLecture = createInitModelFunction(
  CoverageMajorLecture,
  'coverage_major_lecture',
  {
    id: PrimaryAIAttribute,
    lecture_id: {
      type: DataTypes.CHAR(36),
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
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['lecture_id'],
      },
      {
        unique: false,
        fields: ['coverage_major'],
      },
    ],
  }
)

export type CoverageMajorLectureType = {
  lecture_id: string
  coverage_major: string
}
