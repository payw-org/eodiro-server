import { OneApiError, OneApiFunc } from '@/api/one/types'
import { Tip, TipUpdateBody } from '@/database/models/tip'

import { Action } from './interface'
import { TipFileRepository } from '@/database/repository/tip-file-repository'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId, title, body, fileIds } = data
  const { userId } = authPayload
  const updateBody: TipUpdateBody = { title, body }

  try {
    if ((await prisma.tip.findOne({ where: { id: tipId } })) === null) {
      return oneApiResponse<Action>(OneApiError.NO_CONTENT)
    }

    if (!Tip.isOwnedBy(userId, tipId)) {
      return oneApiResponse<Action>(OneApiError.FORBIDDEN)
    }

    Tip.renew(tipId, updateBody)

    // todo: need transaction deleteAll and create
    await TipFileRepository.deleteAll(tipId)

    // create TipFile ManyToMany relation
    fileIds.forEach(async (fileId) => {
      await TipFileRepository.create(tipId, fileId)
    })

    return oneApiResponse<Action>({ isUpdated: true })
  } catch (err) {
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
