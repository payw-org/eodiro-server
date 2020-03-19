import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class Comment extends Model {}

export const comment = createModelFunction(Comment, 'comment', {
  id: PrimaryAIAttribute,
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  likes: {
    type: DataTypes.MEDIUMINT,
    defaultValue: 0,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
})

export type CommentType = {
  id: number
  body: string
  uploaded_at: string
  user_id: string
  likes: number
  post_id: number
  random_nickname: string
}
