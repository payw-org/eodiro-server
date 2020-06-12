import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'
import { userId } from './user'

class LiveChat extends Model {}

export const getLiveChat = createInitModelFunction(LiveChat, 'live_chat', {
  id: PrimaryAIAttribute,
  message: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ...userId,
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
})
