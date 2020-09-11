import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'

class Period extends Model {}

export const period = createInitModelFunction(
  Period,
  'period',
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
    day: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
      allowNull: false,
    },
    start_h: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      allowNull: false,
    },
    start_m: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      allowNull: false,
    },
    end_h: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      allowNull: false,
    },
    end_m: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['lecture_id'],
      },
    ],
  }
)

export type PeriodModelAttr = {
  id?: number
  lecture_id?: string
  day?: string
  start_h?: number
  start_m?: number
  end_h?: number
  end_m?: number
}
