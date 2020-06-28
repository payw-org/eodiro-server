import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { TipFileRepository } from '@/database/repository/tip-file-repository'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, topic, fileIds } = data
  const { userId } = authPayload

  const title = data.title.trim()
  const body = data.body.trim()

  if (title.length === 0) {
    return oneApiResponse<Action>('No Title')
  }

  if (body.length === 0) {
    return oneApiResponse<Action>('No Body')
  }

  const user = await prisma.user.findOne({
    where: {
      id: userId,
    },
  })

  const tipId = await TipRepository.create(
    userId,
    title,
    topic,
    body,
    user.randomNickname
  )

  // create TipFile ManyToMany relation
  fileIds.forEach(async (fileId) => {
    await TipFileRepository.create(tipId, fileId)
  })

  return oneApiResponse<Action>({ tipId })
}

export default func
