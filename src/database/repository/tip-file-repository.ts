import Time from '@/modules/time'
import prisma from '@/modules/prisma'

export class TipFileRepository {
  static async create(tipId: number, fileId: number): Promise<boolean> {
    await prisma.tipFile.create({
      data: {
        tip: {
          connect: {
            id: tipId,
          },
        },
        file: {
          connect: {
            id: fileId,
          },
        },
        createdAt: Time.getPrismaCurrent(),
      },
    })
    return true
  }

  static async deleteAll(tipId: number): Promise<boolean> {
    await prisma.tipFile.deleteMany({
      where: { tipId },
    })
    return true
  }
}
