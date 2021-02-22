import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiCommunityVoteBoardCandidateReqBody = {
  boardCandidateId: number
}

export type ApiCommunityVoteBoardCandidateResData = {
  votesCount: number
  alreadyVoted: boolean
}

const body = makeBodyValidator<ApiCommunityVoteBoardCandidateReqBody>()

router.post<
  any,
  ApiCommunityVoteBoardCandidateResData,
  ApiCommunityVoteBoardCandidateReqBody
>(
  '/community/vote-board-candidate',
  body('boardCandidateId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { boardCandidateId } = req.body

    const boardCandidate = await prisma.communityBoardCandidate.findUnique({
      where: { id: boardCandidateId },
      include: {
        communityBoardCandidateVotes: true,
      },
    })

    if (!boardCandidate) {
      return res.status(httpStatus.NOT_FOUND).end()
    }

    const myVote = await prisma.communityBoardCandidateVote.findUnique({
      where: {
        boardCandidateId_userId: {
          boardCandidateId,
          userId: user.id,
        },
      },
    })

    if (myVote) {
      return res.json({
        alreadyVoted: true,
        votesCount: boardCandidate.communityBoardCandidateVotes.length,
      })
    }

    // Add vote
    await prisma.communityBoardCandidateVote.create({
      data: {
        user: { connect: { id: user.id } },
        communityBoardCandidate: { connect: { id: boardCandidateId } },
      },
    })

    // Count votes
    const votesCount = await prisma.communityBoardCandidateVote.count({
      where: {
        boardCandidateId,
      },
    })

    res.json({ alreadyVoted: false, votesCount })
  }
)

export default router
