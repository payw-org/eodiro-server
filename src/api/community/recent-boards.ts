import { prisma } from '@/modules/prisma'
import { dbTime } from '@/modules/time'
import { SafeCommunityBoard } from '@/types/schema'
import dayjs from 'dayjs'
import express from 'express'
import { getPinnedBoards } from './pinned-boards'

const router = express.Router()

export type ApiCommunityRecentBoardsReqQuery = {
  excludePins: boolean
  onlyNames: boolean
}

export type ApiCommunityRecentBoardsResData = SafeCommunityBoard[]

router.get<
  any,
  any,
  ApiCommunityRecentBoardsReqQuery,
  ApiCommunityRecentBoardsReqQuery
>('/community/recent-boards', async (req, res) => {
  const { excludePins, onlyNames } = req.query

  const recentBoards = await prisma.communityBoard.findMany({
    where: {
      activeAt: {
        gte: dbTime(dayjs().subtract(7, 'day').toDate()),
      },
      isDeleted: false,
    },
    orderBy: [{ priority: 'desc' }, { activeAt: 'desc' }],
    select: {
      id: true,
      name: true,
      description: !onlyNames,
      createdAt: !onlyNames,
    },
  })

  if (excludePins) {
    const pinnedBoards = await getPinnedBoards({ userId: req.user.id })

    const filteredRecentBoards = recentBoards.filter(
      (board) =>
        pinnedBoards.findIndex((pinnedBoard) => pinnedBoard.id === board.id) ===
        -1
    )

    return res.json(filteredRecentBoards)
  }

  res.json(recentBoards)
})

export default router
