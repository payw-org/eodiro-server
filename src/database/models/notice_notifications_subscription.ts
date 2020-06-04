import { DataTypes, Model } from 'sequelize'

import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'

export class NoticeNotificationsSubscription extends Model {}

export const getNoticeNotificationsSubscription = createInitModelFunction(
  NoticeNotificationsSubscription,
  'notice_notifications_subscription',
  {
    id: PrimaryAIAttribute,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    notice_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscribed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['notice_key'],
      },
    ],
  }
)
