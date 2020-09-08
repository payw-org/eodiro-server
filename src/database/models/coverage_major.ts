import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'

class CoverageMajor extends Model {}

export const coverageMajor = createInitModelFunction(
  CoverageMajor,
  'coverage_major',
  {
    coverage_college: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
  }
)

export type CoverageMajorType = {
  name: string
  coverage_college: string
  code: string
}
