import { File } from '@prisma/client'
import prisma from '@/modules/prisma'
import { prismaTimeMod } from '@/modules/time'

export class FileRepository {
  static async findTipFiles(tipId: number): Promise<File[]> {
    const fileList = await prisma.file.findMany({
      where: {
        tipFiles: {
          some: {
            tipId,
          },
        },
      },
    })

    return prismaTimeMod(fileList)
  }
}
