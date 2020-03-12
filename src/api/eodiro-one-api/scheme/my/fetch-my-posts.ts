export interface FetchMyPosts {
  request: {
    action: 'fetchMyPosts'
    data: {
      offset?: number
      amount?: number
    }
  }
}
