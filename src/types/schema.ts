import {
  CommunityBoard,
  CommunityComment,
  CommunityPost,
  CommunitySubcomment,
} from '@/prisma/client'

type SafeContent<T> = Omit<T, 'userId' | 'isDeleted'> & {
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
export type SafeCommunityPost = SafeContent<CommunityPost>
export type SafeCommunityComment = SafeContent<CommunityComment>
export type SafeCommunitySubcomment = SafeContent<CommunitySubcomment>
