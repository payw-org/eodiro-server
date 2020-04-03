import Db from '@/db'
import { DataTypes, Model } from 'sequelize'
import { createGetModelFuncAfterInit } from '../create-get-model-func-after-init'

class Admin extends Model {
  static async isAdmin(userId: number): Promise<boolean> {
    const query = `
        SELECT *
        FROM admin
        WHERE user_id = ?
    `
    const [, results] = await Db.query(query, userId)
    if (results.length === 1) {
      return true
    }

    return false
  }
}

export const admin = createGetModelFuncAfterInit(Admin, 'admin', {
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
