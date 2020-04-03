import { DataTypes, Model } from 'sequelize'
import { createGetModelFuncAfterInit } from '../create-get-model-func-after-init'
import { PrimaryAIAttribute } from '../utils/model-attributes'

class PendingUser extends Model {}

export const pendingUser = createGetModelFuncAfterInit(
  PendingUser,
  'pending_user',
  {
    id: PrimaryAIAttribute,
    portal_id: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    random_nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ['token'],
      },
    ],
  }
)

export type PendingUserType = {
  id: number
  portal_id: string
  password: string
  nickname: string
  random_nickname: string
  registered_at: string
  token: string
}
