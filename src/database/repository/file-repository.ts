import { File } from '@prisma/client'
import prisma from '@/modules/prisma'

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

    return fileList
  }
}
