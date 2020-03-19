import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'

class Admin extends Model {}

export const admin = createModelFunction(Admin, 'admin', {
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
})

export type AdminType = {
  user_id: number
}
