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

/**
 * Return posts equal or smaller than the given post id with the number of given amount
 */
export async function fetchCommentsOfPost(
  data: FetchCommentsOfPost['data']
): Promise<FetchCommentsOfPost['payload']> {
  return
}
