import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'
import { TableInfo } from '../types'

export class PostLike extends Model {}

/**
 * Init `PostLike` model then return it
 */
export const initPostLike = createInitModelFunction(PostLike, 'post_like', {
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
  post_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'post',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
})

export const $PostLike: TableInfo = {
  tableName: 'post_like',
  attrs: {
    user_id: 'user_id',
    post_id: 'post_id',
  },
}
