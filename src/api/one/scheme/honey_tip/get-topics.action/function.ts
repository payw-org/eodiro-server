import { Action } from './interface'
import { OneApiFunction } from '../../types/utils'
import { topicDict } from '@/database/models/tip'

const func: OneApiFunction<Action> = async () => {
  return {
    err: null,
    data: topicDict,
  }
}

export default func
