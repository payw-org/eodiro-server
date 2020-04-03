import { DataTypes, Model } from 'sequelize'
import { createGetModelFuncAfterInit } from '../create-get-model-func-after-init'

export class PostLike extends Model {}

export const initPostLike = createGetModelFuncAfterInit(PostLike, 'post_like', {
  user_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  post_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
})
