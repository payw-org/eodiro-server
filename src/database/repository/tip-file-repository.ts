import { connect } from 'http2'
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
      },
    })
    return true
  }
}
