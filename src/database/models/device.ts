import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

class Device extends Model {}

export const getDevice = createInitModelFunction(Device, 'device', {
  id: PrimaryAIAttribute,
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  device_id: {
    unique: true,
    type: DataTypes.STRING,
    allowNull: false,
  },
  push_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registered_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
})
