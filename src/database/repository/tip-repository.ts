import { TipAttrs, TipResponse } from '../models/tip'

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
}
