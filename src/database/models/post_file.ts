import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'

class PostFile extends Model {}

export const getPostFile = createGetModelFunction(
  PostFile,
  'post_file',
  {
    post_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
    },
    file_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'file',
        key: 'id',
      },
    },
  },
  {
    indexes: [
      {
        fields: ['post_id'],
      },
    ],
  }
)
