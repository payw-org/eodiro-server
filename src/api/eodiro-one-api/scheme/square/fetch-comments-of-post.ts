import { DBSchema } from '../../db-schema'

export interface FetchCommentsOfPost {
  action: 'fetchCommentsOfPost'
  data: {
    postID: number
    offset?: number
    amount?: number
  }
  payload: DBSchema.Comment[]
}
