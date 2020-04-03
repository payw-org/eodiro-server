import { DataTypes, Model } from 'sequelize'
import { createGetModelFuncAfterInit } from '../create-get-model-func-after-init'

class CoverageMajor extends Model {}

export const coverageMajor = createGetModelFuncAfterInit(
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
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
    },
  }
)

export type CoverageMajorType = {
  name: string
  coverage_college: string
  code: string
}
