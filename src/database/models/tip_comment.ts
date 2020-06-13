import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export type TipCommentsResponse = {
  id: number
  userId: number
  body: string
  randomNickname: string
  createdAt: Date
  editedAt: Date
}

export class TipComment extends Model {}

export const getTipComment = createInitModelFunction(
  TipComment,
  'tip_comment',
  {
    id: PrimaryAIAttribute,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    tip_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tip',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    random_nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    is_removed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
)
