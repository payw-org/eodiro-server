import prisma from '@/modules/prisma'
import { SafeCommunityBoard } from '@/types/schema'
import express from 'express'

const router = express.Router()

export type ApiCommunityPinnedBoardsResData = SafeCommunityBoard[]

export async function getPinnedBoards({ userId }: { userId: number }) {
  const pinnedBoards = await prisma.communityBoard.findMany({
    where: {
      isDeleted: false,
      communityBoardPins: {
        some: { userId },
      },
    },
    orderBy: [{ priority: 'desc' }, { name: 'desc' }],
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
    },
  })

  return pinnedBoards
}

router.get<any, ApiCommunityPinnedBoardsResData>(
  '/pinned-boards',
  async (req, res) => {
    const pinnedBoards = await getPinnedBoards({ userId: req.user.id })
    res.json(pinnedBoards)
  }
)

export default router
