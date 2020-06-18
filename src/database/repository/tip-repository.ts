import { Tip, TipAttrs } from '../models/tip'

import Time from '@/modules/time'
import { TipTopic } from '@prisma/client'
import prisma from '@/modules/prisma'

export class TipRepository {
  static async create(
    userId: number,
    title: string,
    topic: TipTopic,
    body: string,
    randomNick: string
  ): Promise<number> {
    const currentTime = Time.getIsoString()
    const tip = await prisma.tip.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        title,
        topic,
        body,
        randomNickname: randomNick,
        createdAt: currentTime,
        editedAt: currentTime,
      },
    })
    return tip.id
  }

  static async findById(tipId: number): Promise<TipAttrs> {
    const tip = await prisma.tip.findOne({
      where: {
        id: tipId,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
    })
    return tip
  }

  static async findByTopic(
    topic: TipTopic,
    pageSize: number,
    page: number
  ): Promise<TipAttrs[]> {
    const tipList = await prisma.tip.findMany({
      where: {
        isRemoved: false,
        topic: topic,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
      take: -pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    })
    return tipList
  }

  static async findAll(pageSize: number, page: number): Promise<TipAttrs[]> {
    const tipList = await prisma.tip.findMany({
      where: {
        isRemoved: false,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
      take: -pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    })
    return tipList
  }
}
