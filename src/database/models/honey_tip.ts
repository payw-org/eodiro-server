import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

class HoneyTip extends Model {
  static topicDict: { [key: string]: string } = {
    'example1': 'EX1',
    'example2': 'EX2',
  }

  static getTopicDisplay(key: string): string {
    return this.topicDict[key]
  }
}

export const getHoneyTip = createInitModelFunction(HoneyTip, 'honey_tip', {
  id: PrimaryAIAttribute,
  topic: {
    type: DataTypes.ENUM,
    values: ['example1', 'etexample2'],
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
