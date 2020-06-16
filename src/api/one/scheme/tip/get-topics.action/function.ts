import { Action } from './interface'
import { OneApiFuncWithoutRequestData } from '@/api/one/types'
import { oneApiResponse } from '@/api/one/utils'
import { topicDict } from '@/database/models/tip'

const func: OneApiFuncWithoutRequestData<Action> = async () => {
  return oneApiResponse<Action>(topicDict)
}

export default func
