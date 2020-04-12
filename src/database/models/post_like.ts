import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'

export type PostLikeAttrs = {
  user_id: number
  post_id: number
}

export class PostLike extends Model {
  static tableName = 'post_like'
  static attrs = {
    user_id: 'user_id',
    post_id: 'post_id',
  }
}

/**
 * Init `PostLike` model then return it
 */
export const initPostLike = createInitModelFunction(
  PostLike,
  PostLike.tableName,
  {
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
  }
)
