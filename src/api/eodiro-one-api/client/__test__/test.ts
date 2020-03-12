import { FetchPostsOfBoard } from '../../scheme'
import { oneAPIClient } from '../index'

oneAPIClient<FetchPostsOfBoard>('http://localhost:4020', {
  action: 'fetchPostsOfBoard',
  data: {
    boardID: 0,
  },
}).then((posts) => {
  console.log(posts)
})
