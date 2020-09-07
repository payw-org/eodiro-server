import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class Period extends Model {}

export const period = createInitModelFunction(
  Period,
  'period',
  {
    id: PrimaryAIAttribute,
    lecture_id: {
      type: DataTypes.CHAR(36),
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
    },
    start_h: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    start_m: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    end_h: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    end_m: {
      type: DataTypes.TINYINT,
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
