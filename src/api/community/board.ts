import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { dbNow } from '@/modules/time'
import express from 'express'

const router = express.Router()

export type ApiCommunityCreateNewBoardReqBody = {
  name: string
  description?: string
}

const createBoardBody = makeBodyValidator<ApiCommunityCreateNewBoardReqBody>()

router.post(
  '/board',
  createBoardBody('name').isString().trim().isLength({
    min: eodiroConst.MIN_BOARD_TITLE_LENGTH,
    max: eodiroConst.MAX_BOARD_TITLE_LENGTH,
  }),
  createBoardBody('description')
    .isString()
    .trim()
    .isLength({
      min: eodiroConst.MIN_BOARD_DESCRIPTION_LENGTH,
      max: eodiroConst.MAX_BOARD_DESCRIPTION_LENGTH,
    })
    .optional(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { name, description } = req.body

    try {
      await prisma.communityBoardCandidate.create({
        data: {
          name,
          description,
          createdAt: dbNow(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })

      res.sendStatus(httpStatus.OK)
    } catch (createError) {
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
  }
)

// Pin board

export type ApiCommunityPinBoardReqBody = {
  boardId: number
}

export type ApiCommunityPinBoardResData = {
  isPinned: boolean
}

const pinBoardBody = makeBodyValidator<ApiCommunityPinBoardReqBody>()

router.post<any, ApiCommunityPinBoardResData, ApiCommunityPinBoardReqBody>(
  '/board/pin',
  pinBoardBody('boardId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { boardId } = req.body

    // Validate board
    const board = await prisma.communityBoard.findFirst({
      where: { id: boardId, isDeleted: false },
    })

    if (!board || board.isDeleted) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const pin = await prisma.communityBoardPin.findUnique({
      where: {
        userId_boardId: {
          userId: user.id,
          boardId,
        },
      },
    })

    if (pin) {
      await prisma.communityBoardPin.delete({
        where: {
          userId_boardId: {
            userId: user.id,
            boardId,
          },
        },
      })

      return res.json({ isPinned: false })
    }

    await prisma.communityBoardPin.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        communityBoard: {
          connect: {
            id: boardId,
          },
        },
      },
    })

    res.json({ isPinned: true })
  }
)

export default router
