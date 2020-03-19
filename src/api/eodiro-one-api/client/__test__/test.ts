import { oneAPIClient } from '../index'

oneAPIClient('http://localhost:4020', {
  action: 'fetchPostsOfBoard',
  data: {
    boardID: 0,
  },
}).then((posts) => {
  console.log(posts)
})
