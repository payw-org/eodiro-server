import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { dbNow } from '@/modules/time'
import express from 'express'

const router = express.Router()

async function isBoardNameExists(boardName: string) {
  const existingBoard = await prisma.communityBoard.findUnique({
    where: {
      name: boardName,
    },
  })
  const existingBoardCandidate = await prisma.communityBoardCandidate.findUnique(
    {
      where: {
        name: boardName,
      },
    }
  )

  return existingBoard || existingBoardCandidate
}

// Check if the board name already exists

export type ApiCommunityCheckBoardNameReqBody = {
  name: string
}

export type ApiCommunityCheckBoardNameResData = {
  isAvailable: boolean
}

const checkBoardBody = makeBodyValidator<ApiCommunityCheckBoardNameReqBody>()

router.post<
  any,
  ApiCommunityCheckBoardNameResData,
  ApiCommunityCheckBoardNameReqBody
>(
  '/board/check',
  checkBoardBody('name').isString().trim().isLength({
    min: eodiroConst.MIN_BOARD_NAME_LENGTH,
    max: eodiroConst.MAX_BOARD_NAME_LENGTH,
  }),
  handleExpressValidation,
  async (req, res) => {
    const { name } = req.body

    const exist = await isBoardNameExists(name)

    res.json({
      isAvailable: !exist,
    })
  }
)

// Create a board

export type ApiCommunityCreateNewBoardReqBody = {
  name: string
  description?: string
}

const createBoardBody = makeBodyValidator<ApiCommunityCreateNewBoardReqBody>()

router.post(
  '/board',
  createBoardBody('name').isString().trim().isLength({
    min: eodiroConst.MIN_BOARD_NAME_LENGTH,
    max: eodiroConst.MAX_BOARD_NAME_LENGTH,
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

    const exist = isBoardNameExists(name)

    if (exist) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: '이미 존재하는 게시판입니다.',
      })
    }

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
