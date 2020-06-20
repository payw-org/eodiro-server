import {
  AddDevice,
  BookmarkTip,
  CreateTip,
  CreateTipComment,
  DeleteComment,
  DeletePost,
  DeleteTip,
  DeleteTipComment,
  EditPost,
  GetArchivedTips,
  GetBoardId,
  GetComments,
  GetDevices,
  GetMyPosts,
  GetMySubscriptions,
  GetNoticeCatalog,
  GetPostById,
  GetPostLikes,
  GetPostsOfBoard,
  GetRecentPostsOfBoard,
  GetTipComments,
  GetTipDetail,
  GetTips,
  GetTopics,
  GetUserId,
  IsPostLiked,
  LikePost,
  LikeTip,
  SavePost,
  Test,
  UpdateNoticeSubscription,
  UpdateTip,
  UploadComment,
  UploadPost,
} from '../scheme'

import { OneApiError } from '../types'
import axios from 'axios'

// ** AUTOMATICALLY GENERATED FUNCTION OVERLOADINGS, DO NOT MODIFY HERE MANUALLY **
export async function oneApiClient(
  host: string,
  request: Omit<AddDevice, 'payload'>
): Promise<AddDevice['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<BookmarkTip, 'payload'>
): Promise<BookmarkTip['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<CreateTip, 'payload'>
): Promise<CreateTip['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<CreateTipComment, 'payload'>
): Promise<CreateTipComment['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<DeleteComment, 'payload'>
): Promise<DeleteComment['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<DeletePost, 'payload'>
): Promise<DeletePost['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<DeleteTip, 'payload'>
): Promise<DeleteTip['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<DeleteTipComment, 'payload'>
): Promise<DeleteTipComment['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<EditPost, 'payload'>
): Promise<EditPost['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetArchivedTips, 'payload'>
): Promise<GetArchivedTips['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetBoardId, 'payload'>
): Promise<GetBoardId['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetComments, 'payload'>
): Promise<GetComments['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetDevices, 'payload'>
): Promise<GetDevices['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetMyPosts, 'payload'>
): Promise<GetMyPosts['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetMySubscriptions, 'payload'>
): Promise<GetMySubscriptions['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetNoticeCatalog, 'payload'>
): Promise<GetNoticeCatalog['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetPostById, 'payload'>
): Promise<GetPostById['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetPostLikes, 'payload'>
): Promise<GetPostLikes['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetPostsOfBoard, 'payload'>
): Promise<GetPostsOfBoard['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetRecentPostsOfBoard, 'payload'>
): Promise<GetRecentPostsOfBoard['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetTipComments, 'payload'>
): Promise<GetTipComments['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetTipDetail, 'payload'>
): Promise<GetTipDetail['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetTips, 'payload'>
): Promise<GetTips['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetTopics, 'payload'>
): Promise<GetTopics['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<GetUserId, 'payload'>
): Promise<GetUserId['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<IsPostLiked, 'payload'>
): Promise<IsPostLiked['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<LikePost, 'payload'>
): Promise<LikePost['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<LikeTip, 'payload'>
): Promise<LikeTip['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<SavePost, 'payload'>
): Promise<SavePost['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<Test, 'payload'>
): Promise<Test['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<UpdateNoticeSubscription, 'payload'>
): Promise<UpdateNoticeSubscription['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<UpdateTip, 'payload'>
): Promise<UpdateTip['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<UploadComment, 'payload'>
): Promise<UploadComment['payload']>
export async function oneApiClient(
  host: string,
  request: Omit<UploadPost, 'payload'>
): Promise<UploadPost['payload']>
// ** AUTOMATICALLY GENERATED FUNCTION OVERLOADINGS, DO NOT MODIFY HERE MANUALLY **
export async function oneApiClient(
  host: string,
  request: Record<string, any>
): Promise<unknown> {
  let accessToken = ''

  const headers = {}

  if (request && request.data && 'accessToken' in request.data) {
    accessToken = request.data['accessToken']

    // Remove `accessToken` key from the data
    delete request.data['accessToken']
    // Move the `accessToken` to headers
    headers['accesstoken'] = accessToken
  }

  const { data } = await axios({
    url: `${host}/one`,
    method: 'POST',
    data: request,
    headers,
  })

  if ('err' in data) {
    const oneApiErr = data['err'] as OneApiError

    if (typeof window !== 'undefined') {
      let msg = ''
      switch (oneApiErr) {
        case OneApiError.BAD_REQUEST:
          msg = '잘못된 요청입니다.'
          break
        case OneApiError.FORBIDDEN:
          msg = '금지된 요청입니다.'
          break
        case OneApiError.UNAUTHORIZED:
          msg = '로그인 정보가 없습니다.'
          break
        case OneApiError.INTERNAL_SERVER_ERROR:
          msg = '서버에 문제가 발생했습니다.'
          break
        default:
          break
      }

      if (msg) {
        window.alert(msg)
      }
    }
  }

  return data
}
