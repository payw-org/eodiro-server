import prisma from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiCommunityAllBoardsResData = {
  isMine: boolean
  isPinned: boolean
  id: number
  name: string
  description: string | null
  priority: number
  isDeleted: boolean
  createdAt: Date
  activeAt: Date | null
}[]

router.get<any, ApiCommunityAllBoardsResData>(
  '/all-boards',
  async (req, res) => {
    const allBoards = await prisma.communityBoard.findMany({
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    })
    const myPins = await prisma.communityBoardPin.findMany({
      where: { userId: req.user.id },
    })
    const boards = allBoards.map((board) => {
      const { createdBy, ...safeBoard } = board
      const isMine = createdBy === req.user.id
      const pinIndex = myPins.findIndex((pin) => pin.boardId === safeBoard.id)

      if (pinIndex !== -1) {
        myPins.splice(pinIndex, 1)

        return {
          ...safeBoard,
          isMine,
          isPinned: true,
        }
      }

      return {
        ...safeBoard,
        isMine,
        isPinned: false,
      }
    })

    res.json(boards)
  }
)

export type ApiCommunityAllBoardCandidatesResData = {
  id: number
  name: string
  description: string | null
  createdAt: Date
  isMine: boolean
  votesCount: number
}[]

router.get<any, ApiCommunityAllBoardCandidatesResData>(
  '/all-board-candidates',
  async (req, res) => {
    const boardCandidates = (
      await prisma.communityBoardCandidate.findMany({
        orderBy: [{ createdAt: 'asc' }],
        include: {
          communityBoardCandidateVotes: true,
        },
      })
    )
      .map((candidate) => {
        const { createdBy, communityBoardCandidateVotes, ...safeCandidate } =
          candidate

        return {
          isMine: createdBy === req.user.id,
          votesCount: communityBoardCandidateVotes.length,
          ...safeCandidate,
        }
      })
      .sort((a, b) => b.votesCount - a.votesCount)

    res.json(boardCandidates)
  }
)

export default router
