import { TipFile } from '@prisma/client'
import prisma from '@/modules/prisma'

// deprecated
// export class TipFileRepository {
//   static async findByTipId(tipId: number): Promise<TipFile[]> {
//     const fileList = await prisma.tipFile.findMany({
//       where: {
//         tipId: tipId,
//       },
//     })
//     return fileList
//   }
// }
