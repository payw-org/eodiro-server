import { DataTypes, Model } from 'sequelize'

import { createInitModelFunction } from '../create-init-model'

export type TipLikeAttrs = {
  user_id: number
  tip_id: number
}

export class TipLike extends Model {
  static tableName = 'tip_like'
}

export const getTipLike = createInitModelFunction(TipLike, TipLike.tableName, {
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
