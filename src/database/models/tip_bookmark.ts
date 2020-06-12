import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export type TipBookMarkAttrs = {
  id: number
  user_id: number
  tip_id: number
}

export class TipBookMark extends Model {}

export const getTipBookMark = createInitModelFunction(
  TipBookMark,
  'tip_bookmark',
  {
    id: PrimaryAIAttribute,
    user_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    tip_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'tip',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  }
)
