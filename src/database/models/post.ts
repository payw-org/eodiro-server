import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class Post extends Model {}

export const post = createModelFunction(Post, 'post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'board',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
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
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
})

export type PostType = {
  id: number
  board_id: number
  title: string
  body: string
  user_id: number
  random_nickname: string
  likes: number
  uploaded_at: string
  edited_at: string
}
