import { OneApiError, OneApiFunc } from '@/api/one/types'
import { Tip, TipResponse } from '@/database/models/tip'

import { Action } from './interface'
import { FileRepository } from '@/database/repository/file-repository'
import { FileResponse } from '@/database/models/file'
import { TipRepository } from '@/database/repository/tip-repository'
import dayjs from 'dayjs'
import { oneApiResponse } from '@/api/one/utils'
import { prismaTimeMod } from '@/modules/time'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload

  try {
    const tip = await TipRepository.findById(tipId)
    if (tip === null || tip.isRemoved) {
      return oneApiResponse<Action>(OneApiError.NO_CONTENT)
    }

    if (tip.userId !== userId && !Tip.isViewd(userId, tipId)) {
      Tip.view(userId, tipId)
    }

    const tipFiles = await FileRepository.findTipFiles(tip.id)
    const fileResponses = tipFiles.map((item) => {
      const response: FileResponse = {
        fileId: item.id,
        path: `/public-user-content/${dayjs(item.uploadedAt).format(
          'YYYYMMDD'
        )}/${item.uuid}/${encodeURIComponent(item.fileName)}`,
        mimeType: item.mime,
        name: item.fileName,
      }
      return response
    })

    const tipResponse: TipResponse = {
      ...tip,
      tipLikes: tip.tipLikes.length,
      tipBookmarks: tip.tipBookmarks.length,
      isLiked: await Tip.isLiked(userId, tipId),
      isBookmarked: await Tip.isBookmarked(userId, tipId),
      tipFiles: fileResponses,
    }

    return oneApiResponse<Action>(prismaTimeMod(tipResponse))
  } catch (err) {
    console.log(err)
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
