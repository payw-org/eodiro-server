import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class User extends Model {}

export const user = createModelFunction(
  User,
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
  },
  {
    indexes: [
      {
        fields: ['portal_id'],
      },
    ],
  }
)

export type UserType = {
  id: number
  portal_id: string
  password: string
  nickname: string
  random_nickname: string
  registered_at: string
}
