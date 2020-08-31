import {
  OneApiError,
  OneApiFunc,
  OneApiFuncWithoutRequestData,
} from '@/api/one/types'

import { Action } from './interface'
import { oneApiResponse } from '../../utils'

const func: OneApiFunc<Action> = async (data) => {
  const response = oneApiResponse<Action>(OneApiError.UNAUTHORIZED)

  return response
}

export default func
