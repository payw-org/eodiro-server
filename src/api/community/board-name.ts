import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeQueryValidator } from '@/modules/express-validator-utils'
import prisma from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiCommunityBoardNameReqQuery = {
  boardId: number
}

export type ApiCommunityBoardNameResData = {
  boardName: string
}

const query = makeQueryValidator<ApiCommunityBoardNameReqQuery>()

router.get<
  any,
  ApiCommunityBoardNameResData,
  any,
  ApiCommunityBoardNameReqQuery
>(
  '/board-name',
  query('boardId').isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const board = await prisma.communityBoard.findUnique({
      where: { id: req.query.boardId },
    })

    if (!board) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    res.json({
      boardName: board.name,
    })
  }
)

export default router
