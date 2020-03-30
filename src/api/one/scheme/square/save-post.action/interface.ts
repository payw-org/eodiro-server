import { OneApiError } from '../../types/utils'

export interface Action {
  data: {
    accessToken: string
    boardId: number
    title: string
    body: string
    fileIds: number[]
    update?: boolean
    postId?: number
  }
  payload: {
    err: OneApiError | 'No Title' | 'No Body' | 'Title Too Long'
    /**
     * Post ID
     */
    data?: number
  }
}
