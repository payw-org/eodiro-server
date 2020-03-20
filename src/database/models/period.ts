import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'

class Period extends Model {}

export const period = createGetModelFunction(Period, 'period', {
  lecture_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'lecture',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  day: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    primaryKey: true,
  },
  start_h: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
  },
  start_m: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
  },
  end_h: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
  },
  end_m: {
    type: DataTypes.TINYINT,
    allowNull: false,
    primaryKey: true,
  },
})

export type PeriodType = {
  lecture_id: number
  day: string
  start_h: number
  start_m: number
  end_h: number
  end_m: number
}
