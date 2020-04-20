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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lecture',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    major_name: {
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
  major_name: string
}
