import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

class Devices extends Model {}

export const getDevices = createInitModelFunction(Devices, 'devices', {
  id: PrimaryAIAttribute,
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  push_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
