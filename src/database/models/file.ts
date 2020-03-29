import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class File extends Model {}

export const getFile = createGetModelFunction(
  File,
  'file',
  {
    id: PrimaryAIAttribute,
    uuid: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    mime: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['uuid'],
      },
    ],
  }
)

export type FileType = {
  id: number
  uuid: string
  file_name: string
  mime: string
  uploaded_at: string
}
