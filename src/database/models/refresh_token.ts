import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class RefreshToken extends Model {}

export const refreshToken = createModelFunction(RefreshToken, 'refresh_token', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  manually_changed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})
