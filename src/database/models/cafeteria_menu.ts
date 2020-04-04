import { DataTypes, Model } from 'sequelize'
import { createInitModelFunction } from '../create-init-model'

class CafeteriaMenu extends Model {}

export const cafeteriaMenu = createInitModelFunction(
  CafeteriaMenu,
  'cafeteria_menu',
  {
    campus: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
    },
    served_at: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }
)

export type CafeteriaMenuType = {
  campus: string
  served_at: string
  data: string
}
