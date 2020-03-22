import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class PostFile extends Model {}

export const getPostFile = createGetModelFunction(PostFile, 'post_file', {
  id: PrimaryAIAttribute,
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
  file_id: {
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
  id: number
  post_id: number
  file_id: number
}
