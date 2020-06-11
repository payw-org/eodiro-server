import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export const topicDict: { [key: string]: string } = {
  'school': '학교생활',
  'interview': '면접',
  'etc': '기타',
}

export type TipAttrs = {
  id: number
  topic: string
  user_id: number
  title: string
  body: string
  random_nickname: string
  is_starred: boolean
  created_at: string
  edited_at: string
}

class Tip extends Model {
  static getTopicDisplay(key: string): string {
    return topicDict[key]
  }
}

export const getTip = createInitModelFunction(Tip, 'tip', {
  id: PrimaryAIAttribute,
  topic: {
    type: DataTypes.ENUM,
    values: ['school', 'interview', 'etc'],
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  random_nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  is_starred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
})
