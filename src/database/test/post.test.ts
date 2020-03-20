import { expect } from 'chai'
import { Database } from '..'
import { getPost } from '../models/post'

let Post

before(async () => {
  Post = await getPost()
})

describe('Test Post Model', () => {
  it('Post 186 is owned by user 12', async () => {
    const isOwnedBy = await Post.isOwnedBy(186, 12)
    expect(isOwnedBy).to.be.true
  })

  it('Post 186 is now owned by user 20', async () => {
    const isOwnedBy = await Post.isOwnedBy(186, 20)
    expect(isOwnedBy).to.be.false
  })
})

after(async () => {
  const sequelize = await Database.getSequelize()
  sequelize.close()
})
