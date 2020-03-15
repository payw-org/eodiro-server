import { OneAPIError } from '../types/utils'

export interface UploadPost {
  action: 'uploadPost'
  data: {
    boardID: number
    title: string
    body: string
    accessToken: string
  }
  payload: {
    err: OneAPIError<'No Title' | 'No Body' | 'Title Too Long'>
    data?: number // Insert ID
  }
}
