import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class ChangePassword extends Model {}

export const changePassword = createModelFunction(
  ChangePassword,
  'change_password',
  {
    token: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    requested_at: {
      type: DataTypes.DATE,
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

export type ChangePasswordType = {
  token: string
  user_id: number
  requested_at: string
}
