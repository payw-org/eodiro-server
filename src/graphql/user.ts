import { gql } from 'apollo-server-express'

const schema = gql`
  type User {
    userId: Int!
  }

  type Query {
    getUsers(userId: Int): [User]
  }
`
