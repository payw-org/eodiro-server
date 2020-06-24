import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export type FileResponse = {
  mimeType: string
  name: string
  fileId: number
  path: string
}

class File extends Model {}

export const getFile = createInitModelFunction(
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
