import {
  CommunityBoard,
  CommunityComment,
  CommunityPost,
  CommunityPostBookmark,
  CommunityPostLike,
  CommunitySubcomment,
} from '@/prisma/client'

type Safe<T> = Omit<T, 'userId' | 'isDeleted'> & {
  isMine: boolean
}

// Safe
export type SafeCommunityBoard = Omit<
  CommunityBoard,
  | 'isDeleted'
  | 'priority'
  | 'activeAt'
  | 'createdBy'
  | 'description'
  | 'createdAt'
> & {
  description?: string | null
  createdAt?: Date
}
export type SafeCommunityPost = Safe<CommunityPost>
export type SafeCommunityComment = Safe<CommunityComment>
export type SafeCommunitySubcomment = Safe<CommunitySubcomment>

// Packed
export type CommunityPostsList = (SafeCommunityPost & {
  communityComments: (SafeCommunityComment & {
    communitySubcomments: SafeCommunitySubcomment[]
  })[]
  communityPostLikes: CommunityPostLike[]
  communityPostBookmarks: CommunityPostBookmark[]
})[]
