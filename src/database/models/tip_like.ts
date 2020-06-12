import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export type TipLikeAttrs = {
  id: number
  user_id: number
  tip_id: number
}

export class TipLike extends Model {}

export const getTipLike = createInitModelFunction(TipLike, 'tip_like', {
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
})
