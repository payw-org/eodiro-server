import { DataTypes, Model } from 'sequelize'
import { createInitModel } from '../create-init-model'

export class PostLike extends Model {}

/**
 * Return `PostLike` model after init
 */
export const initPostLike = createInitModel(PostLike, 'post_like', {
  user_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  post_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
})
