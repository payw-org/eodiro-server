import { DataTypes, Model } from 'sequelize'
import { createModelFunction } from '../create-model-function'
import { PrimaryAIAttribute } from '../utils/model-attributes'

export class Inquiry extends Model {}

export const inquiry = createModelFunction(Inquiry, 'inquiry', {
  id: PrimaryAIAttribute,
  email: {
    type: DataTypes.STRING(320),
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
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
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  answered_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})

export type InquiryType = {
  id: number
  email: string
  title: string
  body: string
  answer: string
  user_id: number
  uploaded_at: string
  answered_at: string
}
