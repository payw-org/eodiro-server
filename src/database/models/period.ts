import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class Period extends Model {}

export const period = createModelFunction(Period, 'period', {
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
