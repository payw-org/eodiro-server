import { DataTypes, Model } from 'sequelize'
import { createGetModelFunction } from '../create-model-function'

class CafeteriaMenu extends Model {}

export const cafeteriaMenu = createGetModelFunction(
  CafeteriaMenu,
  'cafeteria_menu',
  {
    campus: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
    },
    served_at: {
      type: DataTypes.DATE,
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
