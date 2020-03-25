import { OneApiError } from '../types/utils'

export interface UploadPost {
  action: 'uploadPost'
  data: {
    accessToken: string
    boardID: number
    title: string
    body: string
    fileIds: number[]
  }
  payload: {
    err: OneApiError | 'No Title' | 'No Body' | 'Title Too Long'
    data?: number // Insert ID
  }
}
