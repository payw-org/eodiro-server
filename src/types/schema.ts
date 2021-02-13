import {
  CommunityComment,
  CommunityPost,
  CommunitySubcomment,
} from '@prisma/client'

type Safe<T> = Omit<T, 'userId' | 'isDeleted'> & {
  isMine: boolean
}

export type SafeCommunityPost = Safe<CommunityPost>
export type SafeCommunityComment = Safe<CommunityComment>
export type SafeCommunitySubcomment = Safe<CommunitySubcomment>
