import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'

class CoverageMajor extends Model {}

export const coverageMajor = createGetModelFunction(
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
