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
