import requireAll from '@/modules/require-all'
import appRoot from 'app-root-path'
import { GraphQLSchema } from 'graphql'
import { importSchema } from 'graphql-import'
import { IResolvers, makeExecutableSchema } from 'graphql-tools'

const graphQLSchemaPath =
  process.env.NODE_ENV === 'development'
    ? 'src/graphql/schema'
    : appRoot.resolve('/build/src/graphql/schema')
const typeDefs = importSchema('./**/*.graphql')
const resolvers = requireAll<IResolvers>(
  graphQLSchemaPath,
  (fileName: string) => fileName.endsWith('resolvers.ts')
)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export { schema }
