import { DataTypes, ModelAttributeColumnOptions } from 'sequelize'

export const PrimaryAIAttribute: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  allowNull: false,
  autoIncrement: true,
}
