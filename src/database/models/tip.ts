import { DataTypes, Model } from 'sequelize'
import { TipBookmark, TipLike, TipTopic } from '@prisma/client'

import { FileResponse } from './file'
import { PrimaryAIAttribute } from '../utils/model-attributes'
import { createInitModelFunction } from '../create-init-model'
import prisma from '@/modules/prisma'

export const topicDict: { [key: string]: string } = {
  'university': '학교생활',
  'employment': '취업',
  'newbie': '새내기',
  'certificate': '자격증',
  'exam': '시험',
  'club': '동아리',
  'contest': '공모전',
  'etc': '기타',
}

export type TipUpdateBody = {
  title: string
  body: string
}

export type TipAttrs = {
  id: number
  topic: TipTopic
  userId: number
  title: string
  body: string
  isRemoved: boolean
  randomNickname: string
  isArchived: boolean
  createdAt: Date
  editedAt: Date
  tipLikes: TipLike[]
  tipBookmarks: TipBookmark[]
}

export type TipResponse = {
  id: number
  topic: TipTopic
  userId: number
  title: string
  body: string
  randomNickname: string
  isArchived: boolean
  createdAt: Date
  editedAt: Date
  isLiked: boolean
  isBookmarked: boolean
  tipLikes: number
  tipBookmarks: number
  tipFiles: FileResponse[]
}

export type TipListResponse = {
  id: number
  topic: TipTopic
  title: string
  randomNickname: string
  isArchived: boolean
  createdAt: Date
  editedAt: Date
  isLiked: boolean
  isBookmarked: boolean
  tipLikes: number
  tipBookmarks: number
}

export class Tip extends Model {
  static getTopicDisplay(key: string): string {
    return topicDict[key]
  }

  static async archive(tipId: number): Promise<boolean> {
    const tip = await prisma.tip.update({
      where: { id: tipId },
      data: {
        isArchived: true,
      },
    })
    return tip.isArchived
  }

  static async isOwnedBy(userId: number, tipId: number): Promise<boolean> {
    const tip = await prisma.tip.findOne({
      where: { id: tipId },
    })
    return tip.userId === userId ? true : false
  }

  static async view(userId: number, tipId: number): Promise<boolean> {
    await prisma.tipView.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        tip: {
          connect: {
            id: tipId,
          },
        },
      },
    })
    return true
  }

  static async isLiked(userId: number, tipId: number): Promise<boolean> {
    const like = await prisma.tipLike.findMany({
      where: {
        AND: [{ userId: userId }, { tipId: tipId }],
      },
    })
    return like.length !== 0 ? true : false
  }

  static async isBookmarked(userId: number, tipId: number): Promise<boolean> {
    const like = await prisma.tipBookmark.findMany({
      where: {
        AND: [{ userId: userId }, { tipId: tipId }],
      },
    })
    return like.length !== 0 ? true : false
  }
  static async like(userId: number, tipId: number): Promise<boolean> {
    await prisma.tipLike.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        tip: {
          connect: {
            id: tipId,
          },
        },
      },
    })
    return true
  }

  static async unlike(userId: number, tipId: number): Promise<boolean> {
    await prisma.tipLike.delete({
      where: {
        userId: userId,
        tipId: tipId,
      },
    })
    return false
  }

  static async bookmark(userId: number, tipId: number): Promise<boolean> {
    await prisma.tipBookmark.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        tip: {
          connect: {
            id: tipId,
          },
        },
      },
    })
    return true
  }

  static async cancelBookmark(userId: number, tipId: number): Promise<boolean> {
    await prisma.tipBookmark.delete({
      where: {
        userId: userId,
        tipId: tipId,
      },
    })
    return false
  }

  static async renew(
    tipId: number,
    updateBody: TipUpdateBody
  ): Promise<boolean> {
    const { title, body } = updateBody
    await prisma.tip.update({
      where: {
        id: tipId,
      },
      data: { title, body },
    })
    return true
  }

  static async delete(tipId: number): Promise<boolean> {
    await prisma.tip.update({
      where: { id: tipId },
      data: { isRemoved: true },
    })
    return true
  }
}

export const getTip = createInitModelFunction(Tip, 'tip', {
  id: PrimaryAIAttribute,
  topic: {
    type: DataTypes.ENUM,
    values: [
      'university',
      'employment',
      'newbie',
      'certificate',
      'exam',
      'club',
      'contest',
      'etc',
    ],
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
  is_archived: {
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
