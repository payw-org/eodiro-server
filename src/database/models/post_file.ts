import { DataTypes, Model } from 'sequelize'
import { createInitModel } from '../create-init-model'

class PostFile extends Model {}

export const getPostFile = createInitModel(PostFile, 'post_file', {
  post_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  file_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'file',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
})

export type PostFileType = {
  post_id: number
  file_id: number
}
