import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class CoverageMajor extends Model {}

export const coverageMajor = createModelFunction(
  CoverageMajor,
  'coverage_major',
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    coverage_college: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }
)

export type CoverageMajorType = {
  name: string
  coverage_college: string
}
