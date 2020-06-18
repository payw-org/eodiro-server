import { TipAttrs, TipResponse } from '../models/tip'

import { TipTopic } from '@prisma/client'
import prisma from '@/modules/prisma'

export class TipRepository {
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
