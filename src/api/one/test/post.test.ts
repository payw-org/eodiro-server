import { deletePost, editPost } from '../actions/functions'

editPost({
  accessToken: '',
  postId: 108,
  title: 'what',
  body: 'hello',
  fileIds: [],
}).then((payload) => {
  console.log(payload)
})

deletePost({
  accessToken: '',
  postId: 186,
}).then((payload) => {
  console.log(payload)
})
