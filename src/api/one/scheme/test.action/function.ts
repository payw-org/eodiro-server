import { Action } from './interface'
import { OneApiFuncWithoutRequestData } from '@/api/one/types'
import { oneApiResponse } from '../../utils'

const func: OneApiFuncWithoutRequestData<Action> = async () => {
  return oneApiResponse<Action>({
    what: '',
  })
}

export default func
